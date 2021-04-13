import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdsService } from '../../services/ads.service';
@Component({
  selector: 'app-ad-view',
  templateUrl: './ad-view.component.html',
  styleUrls: ['./ad-view.component.scss'],
})
export class AdViewComponent implements OnInit {
  ad: any;
  adId: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private adsService: AdsService
  ) {}

  ngOnInit(): void {
    this.adId = this.activeRoute.snapshot.params.id;
    if (this.adId) {
      this.viewAd();
    }
  }
  viewAd() {
    this.adsService
      .getCurrentAd(this.adId)
      .subscribe((response) => {
        if (response.ad) {
          this.ad = response.ad;
        }
      });
  }
}
