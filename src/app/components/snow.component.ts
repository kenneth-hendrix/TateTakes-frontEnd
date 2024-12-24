import { Component } from '@angular/core';

@Component({
  selector: 'app-snow',
  templateUrl: './snow.component.html',
  styleUrls: ['./snow.component.scss'],
  standalone: true,
})
export class SnowComponent {
  arrayOfSnow: string[] = new Array(200).fill('snow');
}
