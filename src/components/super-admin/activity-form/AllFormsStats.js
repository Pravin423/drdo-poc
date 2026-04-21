import React from "react";
import { FileText, CheckCircle2, XCircle } from "lucide-react";
import SummaryCard from "../../common/SummaryCard";

export default function AllFormsStats({ stats }) {
    const { total = 0, active = 0, inactive = 0 } = stats || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
                title="Total Forms"
                value={total}
                icon={FileText}
                variant="blue"
                delay={0.1}
            />
            <SummaryCard
                title="Active Forms"
                value={active}
                icon={CheckCircle2}
                variant="emerald"
                delay={0.2}
            />
            <SummaryCard
                title="Inactive Forms"
                value={inactive}
                icon={XCircle}
                variant="rose"
                delay={0.3}
            />
        </div>
    );
}
