import type { ReactNode } from "react";

import { AppConfig } from "~/utils/AppConfig";

export const PageFooter = (props: { children?: ReactNode } = {}) => {
	return (
		<div>
			{props.children}
			<div className="border-t border-gray-300 py-8 text-center text-xs">
				© Copyright {new Date().getFullYear()} {AppConfig.title}. Powered by{" "}
				<a href="https://wearetopgroup.com" target="_blank">
					TOP GROUP
				</a>
				.
			</div>
		</div>
	);
};
