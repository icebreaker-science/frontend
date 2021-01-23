import { Pipe, PipeTransform } from '@angular/core';
import { Availability } from './_types/Availability';
import {WikiPage} from './_types/WikiPage';

@Pipe({
  name: 'stringAvailFilter'
})
export class StringAvailFilterPipe implements PipeTransform {

  transform(items: Array<{ device: WikiPage, availability: Availability }> , filterText: string)
    : Array<{ device: WikiPage, availability: Availability }> {
    const ft = filterText.toLocaleLowerCase();
    if (!filterText) {
      return items;
    }
    return items.filter( it => {
      return it.device.title.toLocaleLowerCase().includes(ft) ||
        it.device.description.toLocaleLowerCase().includes(ft) ||
        it.availability.comment.toLocaleLowerCase().includes(ft) ||
        it.availability.institution.toLocaleLowerCase().includes(ft);
    });
  }

}
