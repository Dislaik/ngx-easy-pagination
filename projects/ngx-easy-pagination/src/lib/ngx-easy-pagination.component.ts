import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import type { EasyPaginationOptions } from './easy-pagination-options';
import { CommonModule } from '@angular/common';
import { ColumnDirective } from './column.directive';


@Component({
  selector: 'ngx-easy-pagination',
  standalone: true,
  imports: [CommonModule, ColumnDirective],
  templateUrl: './ngx-easy-pagination.component.html',
  styleUrl: './ngx-easy-pagination.component.css'
})
export class NgxEasyPagination implements OnInit, OnChanges, AfterViewInit {
  @Input() options: EasyPaginationOptions = {};

  defaultOptions: EasyPaginationOptions = {
    type: 'dataTable',
    title: {
      enable: true,
      text: '',
      align: 'left',
      padding: '8px 8px 8px 8px'
    },
    height: '100%',
    width: '100%',
    data: [],
    dataRow: 10,
    columns:[],
    navigation: {
      align: 'right',
      alignClass: 'align-right',
      backButton: {
        text: 'Back'
      },
      nextButton: {
        text: 'Next'
      }
    }
  };

  columnAlign: string = 'align-left';
  pagination: number = 1;
  paginationLengh: number = 0;
  paginationMax: number = 0;
  paginationItems: any = {};
  paginationList: number[] = [];
  paginationListShow: any[] = [];
  isNavigationContainLastPage: boolean = false;
  isNavigationContainFirstPage: boolean = false;
  
  constructor(
    private element: ElementRef
  ) {}

  public ngOnInit(): void {
    this.options = this.defaultOptions;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      if (this.options !== undefined && this.options !== null) {
        this.options = this.mergeDeep(this.defaultOptions, this.options);
        

        this.initializePagination();
        const instance = this.element.nativeElement as HTMLElement;
        console.log(instance)

        this.ngOnInitView(instance);
        setTimeout(() => this.ngOnHeader(instance), 0);
        setTimeout(() => this.ngOnBody(instance), 0);
        setTimeout(() => this.ngOnFooter(instance), 0);
      }
    }
  }

  private initializePagination(): void {

    this.ngOnShowPage(this.options.data, this.pagination)
    this.paginationMax = this.getTotalPages(<[]>this.options.data, <number>this.options.dataRow)
    this.paginationList = this.createRange(this.paginationMax);
    this.paginationListShow = this.paginationList.slice(0, 3);
  }

  public ngAfterViewInit(): void {
    // const instance = this.element.nativeElement as HTMLElement;
    // const card = instance.childNodes[0];
    // const body = card.childNodes[2] as HTMLElement;
    // const footer = card.childNodes[3] as HTMLElement;

    // this.ngOnInitView(instance);
    // this.ngOnHeader(instance);
    // this.ngOnBody(instance);
    // this.ngOnFooter(footer);
  }
  

  private mergeDeep(target: any, source: any): any {
    if (typeof target !== 'object' || target === null) {
      target = {};
    }
    if (typeof source !== 'object' || source === null) {
      return target;
    }
  
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        target[key] = this.mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  
    return target;
  }

  private ngOnInitView(instance: HTMLElement): void {
    instance.style.display = 'block'
    instance.style.width = this.options.width;
    instance.style.height = this.options.height;
    instance.style.overflow = 'hidden';
  }

  private ngOnHeader(instance: HTMLElement): void {

    if (this.options.title.align == 'center') {
      this.options.title.alignClass = 'align-center'
    } else if (this.options.title.align == 'right') {
      this.options.title.alignClass = 'align-right'
    } else {
      this.options.title.alignClass = 'align-left'
    }
  }

  private ngOnBody(instance: HTMLElement): void {
    this.options.columns.forEach(column => {
      if (column.align == 'center') {
        column.columnAlign = 'align-center';
      } else if (column.align == 'right') {
        column.columnAlign = 'align-right';
      } else {
        column.columnAlign = 'align-left';
      }
    });
  }

  private ngOnFooter(instance: HTMLElement): void {
    if (this.options.navigation.align == 'center') {
      this.options.navigation.alignClass = 'justify-content-center'
    } else if (this.options.navigation.align == 'right') {
      this.options.navigation.alignClass = 'justify-content-end'
    } else {
      this.options.navigation.alignClass = 'justify-content-start'
    }

    // const card = instance.childNodes[0];
    // const footer = card.childNodes[3] as HTMLElement;
    // const navigation = footer.childNodes[0] as HTMLElement;

    // navigation.classList.add('d-flex');

    // if (this.options.navigation.align == 'center') {
    //   navigation.classList.add('justify-content-center');
    // } else if (this.options.navigation.align == 'right') {
    //   navigation.classList.add('justify-content-end');
    // } else {
    //   navigation.classList.add('justify-content-start');
    // }

    // console.log(footer)
  }

  private ngOnShowPage(p1: any[], p2: number): void {
    const start = (p2 - 1) * this.options.dataRow;
    const end = start + this.options.dataRow;
    
    this.paginationItems = p1.slice(start, end);
    this.paginationLengh = this.paginationItems.length;
  }


  public ngOnPaginationNext(): void {
    const instance = this.element.nativeElement as HTMLElement;
    this.pagination += 1;

    this.ngOnShowPage(<[]>this.options.data, this.pagination)
    if (this.pagination >= 3 && this.pagination < this.paginationMax) {
      const newPaginationList = this.paginationListShow.map(page => page + 1);
      this.paginationListShow = newPaginationList
    }

    this.ngOnNavigationStartEndPages();
  }

  public ngOnPaginationBack(): void {
    this.pagination -= 1;

    this.ngOnShowPage(<[]>this.options.data, this.pagination)
    
    if (this.pagination >= 2 && this.pagination !== this.paginationMax - 1) {
      const newPaginationList = this.paginationListShow.map(page => page - 1);
      this.paginationListShow = newPaginationList
    }

    this.ngOnNavigationStartEndPages();
  }

  public ngOnPaginationItem(p1: number): void {
    this.ngOnShowPage(<[]>this.options.data, p1)

    if (p1 === 1) {
      const firstElement = this.paginationListShow[0];
      const asd = firstElement - 1;
      const newPaginationList = this.paginationListShow.map(page => page - asd);

      this.paginationListShow = newPaginationList;
    } else if (this.pagination > p1) {
      if (p1 >= 2 && p1 !== this.paginationMax - 1) {
        const newPaginationList = this.paginationListShow.map(page => page - 1);
        this.paginationListShow = newPaginationList
      }
    } else if (p1 === this.paginationMax) {
      const lastElement = this.paginationListShow[this.paginationListShow.length - 1];
      const asd = this.paginationMax - lastElement; 
      const newPaginationList = this.paginationListShow.map(page => page + asd);

      this.paginationListShow = newPaginationList
    } else {
      if (p1 >= 3 && p1 < this.paginationMax) {
        const newPaginationList = this.paginationListShow.map(page => page + 1);
        this.paginationListShow = newPaginationList
      }
    }

    this.ngOnNavigationStartEndPages();

    this.pagination = p1;
  }

  private ngOnNavigationStartEndPages(): void {
    if (this.paginationListShow.includes(this.paginationMax)) {
      this.isNavigationContainLastPage = true;
    } else {
      this.isNavigationContainLastPage = false;
    }

    if (this.paginationListShow.includes(1)) {
      this.isNavigationContainFirstPage = true;
    } else {
      this.isNavigationContainFirstPage = false;
    }
  }

  private getTotalPages(p1: any[], p2: number): number {
    return Math.ceil(p1.length / p2);
  }

  private createRange(p1: number){
    return new Array(p1).fill(0).map((n, index) => index + 1);
  }

  private addClass(p1: HTMLElement, p2: string): void {
    if (!p1.classList.contains(p2)) {
      p1.classList.add(p2);
    }
  }
}
