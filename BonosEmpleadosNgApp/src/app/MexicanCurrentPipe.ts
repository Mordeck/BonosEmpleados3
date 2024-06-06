import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumberFormat'
})
export class CustomNumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    try{

      if (value || value === 0) {
        const parts = value.toFixed(2).toString().split('.');
        const integerPart = parts[0];

        let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formattedDecimal = parts[1];

        // Replace the symbol for millions if necessary
        if (formattedInteger.length > 6) {
          formattedInteger = formattedInteger.replace(/,/, "'");
        }

        return formattedInteger + '.' + formattedDecimal;
      }
    }catch(e){
      console.log('No se pudo darle formato de moneda al valor: ', value);

    }

    return '';
  }
}
