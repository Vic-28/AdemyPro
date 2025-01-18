import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 
import { ScormConverterService } from '../../services/scorm-converter-service.service';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  providers: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isLoading: boolean = false;
  mp4Files: { name: string, content: Blob }[] = [];
  chapterTitles: string[] = [];

  constructor(private scormService: ScormConverterService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return;
    }

    this.isLoading = true;

    const file = input.files[0];

    // Usa el servicio para procesar el archivo
    this.scormService.uploadFile(file).subscribe({
      next: (blob) => {
        // Procesa el archivo devuelto si es necesario
        this.extractFilesFromBlob(blob);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error subiendo el archivo:', err);
        this.isLoading = false;
      }
    });
  }

  extractFilesFromBlob(blob: Blob): void {
    JSZip.loadAsync(blob).then((zip) => {
      zip.forEach((relativePath, file) => {
        if (relativePath.endsWith('.mp4')) {
          file.async('blob').then((content) => {
            this.mp4Files.push({ name: relativePath, content });
          });
        }
        if (relativePath.endsWith('.txt')) {
          file.async('string').then((content) => {
            this.chapterTitles.push(content);
          });
        }
      });
    }).catch((err) => {
      console.error('Error procesando el ZIP:', err);
    });
  }

  downloadAll(): void {
    if (this.mp4Files.length === 0) {
      console.error('No MP4 files to download');
      return;
    }

    const zip = new JSZip();
    this.mp4Files.forEach((file) => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'mp4-files.zip');
    }).catch((err) => {
      console.error('Error al generar el ZIP:', err);
    });
  }
}
