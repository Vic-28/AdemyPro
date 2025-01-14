import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // Asegúrate de instalar este paquete: npm install file-saver

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  isLoading: boolean = false;
  mp4Files: { name: string, content: Blob }[] = []; // Almacena los archivos como blobs

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return;
    }

    this.isLoading = true;
    this.mp4Files = []; // Limpiar la lista de archivos previos

    const file = input.files[0];
    const zip = new JSZip();

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        zip.loadAsync(data).then((zipContent) => {
          const promises: Promise<void>[] = [];
          zipContent.forEach((relativePath, file) => {
            if (relativePath.startsWith('content/assets/') && file.name.toLowerCase().endsWith('.mp4')) {
              const promise = file.async('blob').then((content) => {
                this.mp4Files.push({ name: file.name, content });
              });
              promises.push(promise);
            }
          });

          // Esperar a que se procesen todos los archivos
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

  downloadAll(): void {
    if (this.mp4Files.length === 0) {
      console.warn('No MP4 files to download');
      return;
    }

    const zip = new JSZip();
    this.mp4Files.forEach((file) => {
      zip.file(file.name, file.content); // Agregar cada archivo al ZIP
    });

    zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
      saveAs(zipBlob, 'mp4_files.zip'); // Descargar el archivo ZIP
    }).catch((error) => {
      console.error('Error creando el archivo ZIP:', error);
    });
  }
}
