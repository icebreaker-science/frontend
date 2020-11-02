import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from './_types/Availability';
import {WikiPage} from './_types/WikiPage';

@Pipe({
  name: 'stringAvailFilter'
})
export class StringAvailFilterPipe implements PipeTransform {

  transform(items: Availability[], filterText: string): Availability[] {
    const ft = filterText.toLocaleLowerCase();
    if (!filterText) {
      return items;
    }
    return items.filter( it => {
      return it.comment.toLocaleLowerCase().includes(ft) || it.institution.toLocaleLowerCase().includes(ft);
    });
  }

}
