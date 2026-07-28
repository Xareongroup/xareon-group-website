import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { workflowRules } from "@/lib/workflows/workflowRules";

export default function WorkflowSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">
        Workflow Automation
      </h1>

      <p className="text-slate-600">
        Configure automatic actions throughout your business.
      </p>

      {workflowRules.map((rule) => (
        <Card
          key={rule.event}
          title={rule.name}
          description={rule.description}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Event: {rule.event}
            </span>

            <Badge
              variant={
                rule.enabled
                  ? "success"
                  : "secondary"
              }
            >
              {rule.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}