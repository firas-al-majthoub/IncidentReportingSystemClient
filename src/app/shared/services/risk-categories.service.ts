import { Injectable } from '@angular/core';
import { HttpRequestsService } from './http-requests.service';
import { Observable } from 'rxjs';
import { RiskCategoryFirstLevel } from '../data/model/risk-category-first-level';
import { RiskCategorySecondLevel } from '../data/model/risk-category-second-level';

@Injectable({
  providedIn: 'root',
})
export class RiskCategoriesService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  getFirstLevelCategories(): Observable<RiskCategoryFirstLevel[]> {
    const path = '/risk-categories/first-level';
    return this.httpRequestsService.get<RiskCategoryFirstLevel[]>(path);
  }

  getSecondLevelCategories(
    firstLevelId: number,
  ): Observable<RiskCategorySecondLevel[]> {
    const path = `/risk-categories/${firstLevelId}/second-level`;
    return this.httpRequestsService.get<RiskCategorySecondLevel[]>(path);
  }
}
