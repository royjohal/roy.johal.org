import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface BarChartSeries {
  /** Key in each `data` row this bar reads its value from. */
  dataKey: string;
  /** Legend/tooltip label. Defaults to `dataKey`. */
  label?: string;
  /** CSS color. Defaults to cycling through --chart-1..5. */
  color?: string;
}

export interface BarChartProps {
  /** Row data, e.g. `[{ month: "Apr", posts: 2 }, ...]`. */
  data: Record<string, string | number>[];
  /** Key in each row used for the x-axis category labels. */
  xKey: string;
  /** One entry per bar series. Most charts on this site need just one. */
  bars: BarChartSeries[];
  className?: string;
}

/**
 * A themed, reusable bar chart — data and series are props, not baked into
 * the file, so any post can drop this in with its own dataset instead of
 * copying a one-off component. Colors default to this site's own
 * --chart-1..5 tokens via shadcn's ChartContainer (see chart.tsx).
 */
export function BarChart({ data, xKey, bars, className }: BarChartProps) {
  const config = Object.fromEntries(
    bars.map((bar, i) => [
      bar.dataKey,
      { label: bar.label ?? bar.dataKey, color: bar.color ?? `var(--chart-${(i % 5) + 1})` },
    ])
  ) satisfies ChartConfig;

  return (
    <ChartContainer config={config} className={className ?? "not-prose h-64 w-full"}>
      <RechartsBarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={`var(--color-${bar.dataKey})`} radius={4} />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
