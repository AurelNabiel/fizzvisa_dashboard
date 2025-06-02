export interface OverviewModel {
    status:    number;
    message:   string;
    data:      OverviewData;
    timestamp: Date;
    meta:      Meta;
    path:      string;
}

export interface OverviewData {
    total_customer:           number;
    total_submitted_customer: number;
    total_paid_customer:      number;
}

export interface Meta {
    page:  null;
    limit: null;
}
