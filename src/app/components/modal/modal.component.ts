import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnChanges {
  clickedOutside = false;
  formInput = '';

  @Input() visible = false;
  @Input() input = false;
  @Input() dialogTitle = 'Attention!';
  @Input() dialog = 'Do you confirm?';
  @Input() confirmText = 'Confirm';
  @Input() confirmColor = 'w3-green';
  @Input() closeColor = 'w3-red';

  @Output() close = new EventEmitter<string>();
  @Output() action = new EventEmitter<string>();

  handleChange(newValue: any) {
    this.formInput = newValue;
  }

  ngOnChanges() {
    this.clickedOutside = false;
    this.formInput = '';
  }

  outside() {
    if (this.clickedOutside) {
      this.close.emit();
    } else {
      this.clickedOutside = true;
    }
  }
}
