import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    // HttpClientModule is deprecated
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: []
})
export class AppModule { }
