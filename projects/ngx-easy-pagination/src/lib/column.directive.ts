import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dataTableColumnValue]',
  standalone: true
})
export class ColumnDirective implements AfterViewInit{
  @Input('dataTableColumnValue') columnValue: any;

  constructor(
    private column: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    
    this.processColumn(this.columnValue);
  }

  private processColumn(p1: any) {
    const {item, options} = p1;

    if (options.value.type === 'text') {
      const html = this.processValue(item, options.value.text);

      this.column.nativeElement.innerHTML = html;
    }else if (options.value.type === 'button') {
      const html = this.processValue(item, options.value.button);
      const button = this.renderer.createElement('button');
      const text = this.renderer.createText(html);

      this.renderer.appendChild(button, text);

      this.renderer.listen(button, 'click', () => options.value.click(item));
      this.renderer.appendChild(this.column.nativeElement, button);
      
    } else if (options.value.type === 'function') {
      const html = options.value.function(this.column, item);

      this.column.nativeElement.innerHTML = html;
    } else {
      console.log('ERROR: NgxEasyPagination [...columns.value.type]')
    }
  }

  private processValue(p1: any, p2: string): string {
    return p2.replace(/{{(.*?)}}/g, (match, key) => {
      const keys = key.split('.');
      let value = p1;

      for (const k of keys) {
          if (value && k in value) {
            value = value[k];
          } else {
            return match;
          }
      }

      return value !== undefined ? value : match;
    });
  }
}
