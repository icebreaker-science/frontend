import { Pipe, PipeTransform } from '@angular/core';
import { WikiPage } from './_types/WikiPage';

@Pipe({
  name: 'stringFilter'
})
export class StringFilterPipe implements PipeTransform {

  transform(items: WikiPage[], filterText: string): WikiPage[] {
    const ft = filterText.toLocaleLowerCase();
    if (!filterText) {
      return items;
    }
    return items.filter( it => {
      return it.title.toLocaleLowerCase().includes(ft) || it.description.toLocaleLowerCase().includes(ft);
    });
  }

}
