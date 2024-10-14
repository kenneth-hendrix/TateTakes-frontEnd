import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeathThreatService } from '../../services/death-threat.service';
import { HeaderComponent } from "../header/header.component";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-death-threats',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './death-threats.component.html',
  styleUrl: './death-threats.component.scss',
})
export class DeathThreatsComponent {
  threatForm: FormGroup;

  private fb = inject(FormBuilder);
  private deathThreatService = inject(DeathThreatService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    this.threatForm = this.fb.group({
      message: ['', [Validators.required]],
    });
  }

  submitNewThreat() {
    if (this.threatForm.valid) {
      this.spinner.show();
      const { message } = this.threatForm.value;
      this.deathThreatService
        .newThreat(message)
        .then(() => {
          this.spinner.hide();
          this.threatForm.reset();
          this.toastr.success('That will show him!', 'Threat sent succesfully');
        })
        .catch((error) => {
          this.spinner.hide();
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        });
    }
  }
}
