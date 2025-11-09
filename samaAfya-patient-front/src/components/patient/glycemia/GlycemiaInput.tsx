import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getGlycemiaStatus } from "@/data/mockData";
import { Clock, Check } from "lucide-react";

interface GlycemiaInputProps {
  moment: string;
  label: string;
  time: string;
  existingValue?: number;
}

const statusConfig = {
  hypo: { label: "Hypoglycémie", color: "bg-medical-hypo text-white" },
  normal: { label: "Normal", color: "bg-medical-normal text-white" },
  warning: { label: "À surveiller", color: "bg-medical-warning text-white" },
  high: { label: "Trop élevé", color: "bg-medical-high text-white" },
};

export const GlycemiaInput = ({ moment, label, time, existingValue }: GlycemiaInputProps) => {
  const [value, setValue] = useState<string>(existingValue?.toFixed(2) || "");
  const [saved, setSaved] = useState(!!existingValue);

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0 || numValue > 3) {
      // Soft error handling - subtle border color change
      return;
    }

    const status = getGlycemiaStatus(numValue, moment);
    setSaved(true);
    // Soft visual feedback with gentle animation
  };

  const numValue = parseFloat(value);
  const status = !isNaN(numValue) ? getGlycemiaStatus(numValue, moment) : null;

  return (
    <Card className={`transition-all duration-300 ${saved ? "border-accent bg-accent/5 shadow-md" : "hover:shadow-sm"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {time}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={`glycemia-${moment}`} className="text-sm">
                Glycémie (g/L)
              </Label>
              <Input
                id={`glycemia-${moment}`}
                type="number"
                step="0.01"
                min="0"
                max="3"
                placeholder="Ex: 0.92"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setSaved(false);
                }}
                className="mt-1"
                disabled={saved}
              />
            </div>
            {saved ? (
              <Button
                variant="outline"
                size="icon"
                className="bg-accent/10 border-accent"
              >
                <Check className="h-4 w-4 text-accent" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={!value}>
                Enregistrer
              </Button>
            )}
          </div>

          {status && (
            <Badge className={statusConfig[status].color}>
              {statusConfig[status].label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};