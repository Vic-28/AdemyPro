import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Indica si se está cargando un archivo
  isLoading: boolean = false;
  
  // Almacena los archivos MP4 seleccionados
  mp4Files: { name: string, content: Blob }[] = []; 
  
  // Almacena los títulos de los capítulos extraídos
  chapterTitles: string[] = []; 

  // Maneja el evento de selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return;
    }

    this.isLoading = true;
    this.mp4Files = [];
    this.chapterTitles = []; 

    const file = input.files[0];
    const zip = new JSZip();

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        zip.loadAsync(data).then((zipContent) => {
          const promises: Promise<void>[] = [];
          zipContent.forEach((relativePath, file) => {
            
            // Procesa archivos MP4 dentro del ZIP
            if (relativePath.startsWith('content/assets/') && file.name.toLowerCase().endsWith('.mp4')) {
              const promise = file.async('blob').then((content) => {
                this.mp4Files.push({ name: file.name, content });
              });
              promises.push(promise);
            }

            // Procesa archivos HTML dentro del ZIP
            if (file.name.toLowerCase().endsWith('.html')) {
              const promise = file.async('string').then((content) => {
                this.extractTitles(content);
              });
              promises.push(promise);
            }
          });

          // Finaliza la carga cuando todas las promesas se resuelven
          Promise.all(promises).then(() => {
            this.isLoading = false;
          });
        }).catch((error) => {
          console.error('Error procesando el archivo ZIP:', error);
          this.isLoading = false;
        });
      }
    };

    reader.onerror = (error) => {
      console.error('Error leyendo el archivo:', error);
      this.isLoading = false;
    };

    reader.readAsArrayBuffer(file);
  }

  // Extrae títulos de capítulos de contenido HTML
  extractTitles(htmlContent: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const matches = htmlContent.match(/"fileName":"(CAP[^"]*)"/g);
    if (matches) {
      matches.forEach((match) => {
        const title = match.match(/"fileName":"(CAP[^"]*)"/)?.[1];
        if (title) {
          this.chapterTitles.push(title);
        }
      });
    }
    // Ordena los títulos de los capítulos de forma ascendente por el número después de "CAP"
    this.chapterTitles.sort((a, b) => {
      const numA = parseInt(a.replace('CAP', ''), 10);
      const numB = parseInt(b.replace('CAP', ''), 10);
      return numA - numB;
    });
    console.log('Hay un total de: ' + this.chapterTitles.length);
  }

  // Descarga todos los archivos MP4 como un archivo ZIP
  downloadAll(): void {
    if (this.mp4Files.length === 0) {
      console.warn('No MP4 files to download');
      return;
    }

    const zip = new JSZip();
    this.mp4Files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      saveAs(zipBlob, 'mp4_files.zip'); 
    }).catch((error) => {
      console.error('Error creando el archivo ZIP:', error);
    });

    
  }
}
