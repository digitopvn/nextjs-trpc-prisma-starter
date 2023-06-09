import { TablePaginationConfig } from "antd";
import { FilterValue } from "antd/es/table/interface";

export interface TableParams {
	pagination?: any;
	field?: string;
	order?: string;
	filters?: Record<string, FilterValue>;
}
