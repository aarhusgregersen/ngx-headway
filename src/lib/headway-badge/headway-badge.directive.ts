import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { HEADWAY_ACCOUNT_TOKEN } from "../tokens";

export interface HeadwayWidgetConfig {
  headwayAccountId: string;
}

const defaultHeadwayWidgetSelector = "HW_widget_component";

@Directive({
  selector: "[headwayBadge]",
  standalone: true,
})
export class HeadwayBadgeDirective implements OnInit, OnDestroy {
  private elementRef: HTMLElement;
  private badgePosition: string = "right";
  private translations = {};

  @Output() widgetReady = new EventEmitter<boolean>();
  @Output() showWidget = new EventEmitter<boolean>();
  @Output() showDetails = new EventEmitter<boolean>();
  @Output() readMore = new EventEmitter<boolean>();
  @Output() hideWidget = new EventEmitter<boolean>();

  private widget: any;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(HEADWAY_ACCOUNT_TOKEN) private headwayAccountId: string
  ) {
    this.elementRef = el.nativeElement;

    if (
      this.elementRef.classList.length === 0 ||
      this.elementRef.classList === undefined ||
      this.elementRef.classList.contains(defaultHeadwayWidgetSelector)
    ) {
      this.elementRef.classList.add(defaultHeadwayWidgetSelector);
    }
  }

  initHeadway() {
    const hwConfig = {
      selector: `.${defaultHeadwayWidgetSelector}`,
      account: this.headwayAccountId,
      callbacks: {
        onWidgetReady: (widget: boolean) => {
          this.widgetReady.emit(widget);
        },
        onShowWidget: () => this.showWidget.emit(),
        onShowDetails: (changelog: boolean) => {
          this.showDetails.emit(changelog);
        },
        onReadMore: (changelog: boolean) => this.readMore.emit(changelog),
        onHideWidget: () => this.hideWidget.emit(),
      },
      badgePosition: this.badgePosition,
      translations: this.translations,
    };

    this.widget = (window as any).Headway.getNewWidget();
    this.widget.init(hwConfig);
  }

  ngOnDestroy(): void {
    this.widget?.destroy();
  }

  ngOnInit(): void {
    const head = document.getElementsByTagName("head")[0];
    if ((window as any).Headway) {
      head.removeChild(document.getElementById("HWScript")!);
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "HWScript";
    script.onload = () => {
      this.initHeadway();
    };
    script.src = "https://cdn.headwayapp.co/widget.js";
    head.appendChild(script);
  }
}
