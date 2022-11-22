import { GalleryService } from './../gallery.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private galleryService: GalleryService,
    private changeDetector: ChangeDetectorRef
  ) {}

  tags = ['realism', 'anime', 'wallpaper', 'art'];
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      file: new FormControl(null, [Validators.required]),
      fileSource: null,
      source: new FormControl(null, [Validators.required]),
      tags: new FormControl([], [Validators.required]),
    });
  }

  onSubmit(): void {
    this.galleryService.post(this.form.value);
    this.form.reset();
  }

  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      console.log(file);

      reader.onload = () => {
        this.form.patchValue({
          fileSource: reader.result,
        });

        // need to run changeDetector since file load runs outside of zone
        this.changeDetector.markForCheck();
      };
    } else {
      this.form.patchValue({
        fileSource: null,
      });
    }
  }

  get source() {
    return this.form.get('source');
  }
}
