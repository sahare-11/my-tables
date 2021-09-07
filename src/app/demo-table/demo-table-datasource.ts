import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DemoTableItem {
  name: string;
  id: number;
  weight: number;
  last: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DemoTableItem[] = [
  {id: 1, name: 'Hydrogen', last: 'smith', weight:34},
  {id: 2, name: 'Helium',last: 'smith', weight:34},
  {id: 3, name: 'Lithium',last: 'smith', weight:34},
  {id: 4, name: 'Beryllium',last: 'smith', weight:44},
  {id: 5, name: 'Boron',last: 'smith', weight:87},
  {id: 6, name: 'Carbon',last: 'smith', weight:67},
  {id: 7, name: 'Nitrogen',last: 'smith', weight:54},
  {id: 8, name: 'Oxygen',last: 'Roy', weight:33},
  {id: 9, name: 'Fluorine',last: 'smith', weight:35},
  {id: 10, name: 'Neon',last: 'smith', weight:34},
  {id: 11, name: 'Sodium',last: 'smith', weight:34},
  {id: 12, name: 'Magnesium',last: 'smith', weight:34},
  {id: 13, name: 'Aluminum',last: 'smith', weight:34},
  {id: 14, name: 'Silicon',last: 'smith', weight:34},
  {id: 15, name: 'Phosphorus',last: 'smith', weight:34},
  {id: 16, name: 'Sulfur',last: 'smith', weight:34},
  {id: 17, name: 'Chlorine',last: 'smith', weight:34},
  {id: 18, name: 'Argon',last: 'smith', weight:34},
  {id: 19, name: 'Potassium',last: 'smith', weight:34},
  {id: 20, name: 'Calcium',last: 'smith', weight:34},
];

/**
 * Data source for the DemoTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DemoTableDataSource extends DataSource<DemoTableItem> {
  data: DemoTableItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DemoTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DemoTableItem[]): DemoTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DemoTableItem[]): DemoTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
