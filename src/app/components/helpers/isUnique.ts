import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isUnique(list: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isUniqueBool = list
      ?.map((str) => str.toLocaleLowerCase())
      .includes(control?.value?.toLocaleLowerCase());

    return isUniqueBool ? { notUnique: true } : null;
  };
}
