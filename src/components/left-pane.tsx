import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeftPane() {
  return (
    <aside className="w-[15vw] min-w-[240px] max-w-[320px] h-full border-r bg-background flex flex-col p-4 gap-6">
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Location</h2>
        <div className="space-y-2">
          <Label htmlFor="location-search">Search</Label>
          <Input
            id="location-search"
            placeholder="e.g., Ladakh, India"
            autoComplete="on"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="lat">Lat</Label>
            <Input id="lat" placeholder="0.00" readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Lng</Label>
            <Input id="lng" placeholder="0.00" readOnly className="bg-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Time & Date</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="date">Date</Label>
          </div>
          <Input id="date" type="date" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="time">Time</Label>
          </div>
          <Input id="time" type="time" />
        </div>
      </div>
    </aside>
  );
}
