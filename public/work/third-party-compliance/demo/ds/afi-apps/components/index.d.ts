// Types for AfiModernDesignSystem_dc4c68 (documentation; not type-checked). Concatenated from components/src/<group>/<Comp>.d.ts.

// ---- BarChart (components/src/charts/BarChart.d.ts)
export interface BarDatum { label: string; value: number; color?: string; }
export interface BarChartProps {
  /** With `series`, BarChart draws the stack (v143): the parts of each bar, same as StackedBarChart. `data` is then one row per bar with a value per series name. */
  series?: string[];
  groupBelow?: number;
  otherLabel?: string;
  edge?: boolean;
  patterns?: 'auto' | boolean;
  colors?: string[];
  /** Default true: every bar grey except the highlighted one (one series over time). false: each bar takes the next series colour. */
  single?: boolean;
  /** With single: the bar that keeps the dark colour. 'max' (default) is the highest bar; 'last', an index, or null for none. Hover moves it. */
  highlight?: 'max' | 'last' | number | null;
  /** Hover and arrow keys show a tooltip with the bar's label and value. With `detail`, a click, a tap or Enter pins the bar in a side panel. */
  interactive?: boolean;
  chartLabel?: string;
  /** What the panel shows for a bar: a title, a subtitle, rows ({ label, value, color? }) and a total. Default: the value and its share of the total. */
  detail?: (index: number) => { title?: React.ReactNode; subtitle?: React.ReactNode; rows?: Array<{ label: React.ReactNode; value: React.ReactNode; color?: string }>; total?: { label: React.ReactNode; value: React.ReactNode } };
  panel?: 'auto' | 'off';
  panelHint?: string; panelLabel?: string; prevLabel?: string; nextLabel?: string; closePanelLabel?: string;
  /** The pinned bar (controlled), and its change handler. */
  selectedIndex?: number | null;
  onSelect?: (index: number | null) => void;
  /** Title of the chart: the heading of the Ampliar view and its accessible name. */
  title?: string;
  /** The unit, written once (shown above the chart, and beside the last value in glance mode). */
  unit?: string;
  /** Formats the values (default es-ES). */
  formatValue?: (v: number) => string;
  /** Thin the x labels to at most this many. */
  maxLabels?: number;
  /** Write each bar's value above it (used in the Ampliar view). */
  showValues?: boolean;
  /** A text description for screen readers. */
  description?: string;
  /** Add a "Ver datos" disclosure with the values as a table. */
  dataTable?: boolean;
  /** Deprecated: ignored since v130 (the table is behind a Gráfico | Tabla switch). */
  dataLabel?: string;
  /** The switch labels and the first column header of the table view. */
  graphLabel?: string;
  tableLabel?: string;
  rowLabel?: string;
  /** 'auto' (default): on a phone (560 px and narrower) show the last six bars, the last value as a big label, three x labels and an Ampliar button; 'off' always draws the full chart; 'always' forces it. */
  glance?: 'auto' | 'off' | 'always';
  expand?: boolean;
  expandLabel?: string;
  closeLabel?: string;
  data: BarDatum[] | Array<{ label: string; [series: string]: string | number }>;
  /** Colour of the highlighted bar: 'primary' (default, navy), monochrome, or positive/negative. */
  /** Colour look (v143). 'ramp': navy to Afi blue to sky. 'distinct': the distinct line colours (default for lines and bars). 'monochrome'. 'positive-negative': green and red. */
  /** v150: true adds a ⋯ menu with "Descargar datos (CSV)" (semicolon-separated, comma decimals: it opens in Spanish Excel). Default false. */
  downloads?: boolean;
  look?: 'distinct' | 'ramp' | 'monochrome' | 'positive-negative';

  /** Legacy name of `look` (a string still works; 'primary' is read as 'distinct'). */
  style?: 'primary' | 'ramp' | 'monochrome' | 'positive-negative';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  height?: number;
  showAxis?: boolean;
  className?: string;
}
export declare function BarChart(props: BarChartProps): JSX.Element;

// ---- DonutChart (components/src/charts/DonutChart.d.ts)
export interface DonutDatum { label: string; value: number; color?: string; }
export interface DonutChartProps {
  title?: string;
  /** Shown beside the biggest slice's percentage in glance mode. */
  unit?: string;
  formatValue?: (v: number) => string;
  /** Legend rows read "label: value (percentage)" (used in the Ampliar view). */
  showValues?: boolean;
  description?: string;
  dataTable?: boolean;
  /** Deprecated: ignored since v130 (the table is behind a Gráfico | Tabla switch). */
  dataLabel?: string;
  /** The switch labels and the first column header of the table view. */
  graphLabel?: string;
  tableLabel?: string;
  rowLabel?: string;
  /** 'auto' (default): on a phone (560 px and narrower) show a small donut, the biggest slice as a big percentage with its label, and an Ampliar button that opens the donut with its full legend; 'off' keeps the full chart; 'always' forces it. */
  glance?: 'auto' | 'off' | 'always';
  expand?: boolean;
  expandLabel?: string;
  closeLabel?: string;
  data: DonutDatum[];
  /** 'ramp' (default): navy to Afi blue to sky, first and biggest slice darkest. ('primary' is read as 'ramp'; the distinct-colour option was removed in v142.) */
  /** Colour look (v143). 'ramp': navy to Afi blue to sky. 'distinct': the distinct line colours (default for lines and bars). 'monochrome'. 'positive-negative': green and red. */
  /** v150: true adds a ⋯ menu with "Descargar datos (CSV)" (semicolon-separated, comma decimals: it opens in Spanish Excel). Default false. */
  downloads?: boolean;
  look?: 'ramp' | 'monochrome' | 'positive-negative';

  /** Legacy name of `look` (a string still works; 'primary' is read as 'distinct'). */
  style?: 'ramp' | 'monochrome' | 'positive-negative';
  /** Hover a slice or a legend row: the others are muted and the row shows its value and share. */
  interactive?: boolean;
  /** A thin outline on the palest (last) slice, where "Otros" goes, so it holds against a white card. Default: on for the ramp. */
  edge?: boolean;
  /** Patterns on parts six to ten. 'auto' (default) follows the person's setting (the Patrones item in the chart's ⋯ menu); true or false forces it. */
  patterns?: 'auto' | boolean;
  /** Parts under this percentage are merged into one last "Otros" part (default 5; 0 turns it off). With the ramp (ten steps: five blues, then five slate greys), at most nine parts keep a name when there is an "Otros". The legend lists what is inside. */
  groupBelow?: number;
  /** The name of the merged part (default "Otros"). */
  otherLabel?: string;
  size?: 'sm' | 'md';
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  legend?: boolean;
  className?: string;
}
export declare function DonutChart(props: DonutChartProps): JSX.Element;

// ---- LegendGroup (components/src/charts/LegendGroup.d.ts)
export interface LegendGroupProps {
  children?: React.ReactNode;
  className?: string;
}
export declare function LegendGroup(props: LegendGroupProps): JSX.Element;

// ---- LegendItem (components/src/charts/LegendItem.d.ts)
export interface LegendItemProps {
  label: React.ReactNode;
  /** Any CSS colour; prefer a --chart-* token. */
  color?: string;
  /** swatch = filled square, line = 2px rule, pattern = hatched square. */
  type?: 'swatch' | 'line' | 'pattern';
  /** A chart pattern for the swatch, 0 to 4 (diagonal, horizontal, dots, crosshatch, vertical), drawn over `color`. */
  pattern?: number;
  value?: React.ReactNode;
  className?: string;
}
export declare function LegendItem(props: LegendItemProps): JSX.Element;

// ---- LegendItemLine (components/src/charts/LegendItemLine.d.ts)
export interface LegendItemLineProps {
  label: React.ReactNode;
  color?: string;
  value?: React.ReactNode;
  className?: string;
}
export declare function LegendItemLine(props: LegendItemLineProps): JSX.Element;

// ---- LegendItemPattern (components/src/charts/LegendItemPattern.d.ts)
export interface LegendItemPatternProps {
  label: React.ReactNode;
  color?: string;
  value?: React.ReactNode;
  className?: string;
}
export declare function LegendItemPattern(props: LegendItemPatternProps): JSX.Element;

// ---- LegendItemSwatch (components/src/charts/LegendItemSwatch.d.ts)
export interface LegendItemSwatchProps {
  label: React.ReactNode;
  color?: string;
  value?: React.ReactNode;
  className?: string;
}
export declare function LegendItemSwatch(props: LegendItemSwatchProps): JSX.Element;

// ---- LineChart (components/src/charts/LineChart.d.ts)
export interface LineSeries { name?: string; values: number[]; color?: string; /** Dashed stroke — the forecast convention. */ dashed?: boolean; /** A total or a target: near-black and dotted, and it takes no step of the palette. */ reference?: boolean; }
export interface LineChartProps {
  /** A unit sign on every y tick ("€" reads "2.000 €"). With yAxis the top of the scale is a round number. */
  tickUnit?: string;
  /** Title of the chart: the heading of the Ampliar view and its accessible name. */
  title?: string;
  /** The unit, written once as the axis title ("millones de €"); the ticks stay plain numbers. */
  unit?: string;
  /** Show three plain y ticks (max, middle, min) to the left of the plot. */
  yAxis?: boolean;
  /** Formats the y ticks (default: plain es-ES numbers with a dot for thousands). */
  formatTick?: (v: number) => string;
  /** Thin the x labels to at most this many (first, middle, last...). */
  maxLabels?: number;
  /** A text description for screen readers. */
  description?: string;
  /** Add a "Ver datos" disclosure with the values as a table. */
  dataTable?: boolean;
  /** Deprecated: ignored since v130 (the table is behind a Gráfico | Tabla switch). */
  dataLabel?: string;
  /** The switch labels and the first column header of the table view. */
  graphLabel?: string;
  tableLabel?: string;
  rowLabel?: string;
  /** 'auto' (default): on a phone (560 px and narrower) show one or two series with the last value as a big label, no grid, three x labels and an Ampliar button; 'off' always draws the full chart; 'always' forces it. */
  glance?: 'auto' | 'off' | 'always';
  /** Show the Ampliar button in glance mode. */
  expand?: boolean;
  expandLabel?: string;
  closeLabel?: string;
  series: LineSeries[];
  labels?: string[];
  /** Colour look (v143). 'ramp': navy to Afi blue to sky. 'distinct': the distinct line colours (default for lines and bars). 'monochrome'. 'positive-negative': green and red. */
  /** v150: true adds a ⋯ menu with "Descargar datos (CSV)" (semicolon-separated, comma decimals: it opens in Spanish Excel). Default false. */
  downloads?: boolean;
  /** v150: a series name or index. Every other line is grey from the start, like a single bar chart; hovering a line name moves it and it returns when the pointer leaves. Default none. */
  highlight?: string | number;
  look?: 'ramp' | 'distinct' | 'monochrome' | 'positive-negative';

  /** Legacy name of `look` (a string still works; 'primary' is read as 'distinct'). */
  style?: 'primary' | 'monochrome' | 'positive-negative';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** An end shape and the series name at the end of every line. 'auto' (default): two or more series, not on a phone. */
  endLabels?: 'auto' | boolean;
  /** Write the last value beside each end name (default true). */
  endValues?: boolean;
  /** Formats that last value; default is formatValue. A compact format reads best, for example '664 k €'. */
  formatEnd?: (v: number) => string;
  /** Pinned side panel: 'auto' (default) turns the tooltip into an invitation and pins the point in a panel when there are more than three series; 'always' or 'off' force it. */
  panel?: 'auto' | 'always' | 'off';
  /** What the panel shows for a point: a title, a subtitle, rows ({ label, value, color?, dashed? }) and a total. Default: the title is the label, the rows are the series. */
  detail?: (index: number) => { title?: React.ReactNode; subtitle?: React.ReactNode; rows?: Array<{ label: React.ReactNode; value: React.ReactNode; color?: string; dashed?: boolean }>; total?: { label: React.ReactNode; value: React.ReactNode } };
  panelHint?: string; panelLabel?: string; prevLabel?: string; nextLabel?: string; closePanelLabel?: string;
  /** The pinned point (controlled), and its change handler. */
  selectedIndex?: number | null;
  onSelect?: (index: number | null) => void;
  /** Hover readout with a vertical guide and a tooltip. */
  interactive?: boolean;
  /** Formats a value in the readout and the axis. */
  formatValue?: (v: number) => string;
  /** Spoken description of the chart. */
  chartLabel?: string;
  /** Fill under the line at 12% opacity. */
  /** true = flat 12 % fill; 'gradient' = fades from 32 % to 0 (v103). */
  area?: boolean | 'gradient';
  /** Horizontal gridlines behind the lines. Default false (v139), like bar charts. */
  grid?: boolean;
  className?: string;
}
export declare function LineChart(props: LineChartProps): JSX.Element;

// ---- StackedBarChart (components/src/charts/StackedBarChart.d.ts)
export interface StackedBarChartProps {
  /** v151: the ⋯ menu with the CSV and Patrones. Default: on above five parts. */
  downloads?: boolean;
  /** Each datum carries a label plus one numeric field per series key. */
  data: Array<{ label: string; [series: string]: string | number }>;
  series: string[];
  /** 'ramp' (default): navy to Afi blue to sky, first series darkest at the bottom. ('primary' is read as 'ramp'; the distinct-colour option was removed in v142.) */
  /** Colour look (v143). 'ramp': navy to Afi blue to sky. 'distinct': the distinct line colours (default for lines and bars). 'monochrome'. 'positive-negative': green and red. */
  look?: 'ramp' | 'monochrome' | 'positive-negative';

  /** Legacy name of `look` (a string still works; 'primary' is read as 'distinct'). */
  style?: 'ramp' | 'monochrome' | 'positive-negative';
  /** Your own colours, one per series. */
  colors?: string[];
  /** A thin outline on the palest (top) step so it holds against a white card. Default: on for the ramp. */
  edge?: boolean;
  /** Patterns on parts six to ten. 'auto' (default) follows the person's setting (the Patrones item in the chart's ⋯ menu); true or false forces it. */
  patterns?: 'auto' | boolean;
  /** Parts under this percentage are merged into one last "Otros" part (default 5; 0 turns it off). With the ramp (ten steps: five blues, then five slate greys), at most nine parts keep a name when there is an "Otros". The legend lists what is inside. */
  groupBelow?: number;
  /** The name of the merged part (default "Otros"). */
  otherLabel?: string;
  height?: number;
  /** Hover a stack: the others go grey and the side panel follows. Hover a segment: only it keeps its colour. Click, a tap or Enter pins a stack. The panel is always shown (the hovered stack, else the pinned one, else the latest). */
  interactive?: boolean;
  panel?: 'auto' | 'off';
  chartLabel?: string;
  unit?: string;
  formatValue?: (v: number) => string;
  /** The pinned stack (controlled), and its change handler. */
  selectedIndex?: number | null;
  onSelect?: (index: number | null) => void;
  panelHint?: string; panelLabel?: string; prevLabel?: string; nextLabel?: string; closePanelLabel?: string;
  className?: string;
}
export declare function StackedBarChart(props: StackedBarChartProps): JSX.Element;


// ---- Button (components/src/core/Button.d.ts)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** v148: 'orb' draws OrbButton (a pill with a round glyph at the end; takes icon and motion) and 'slide' draws SlideButton (fills left to right on hover; takes appearance and shape). Brand colours. variant is ignored with an effect. OrbButton and SlideButton keep their names. */
  effect?: 'orb' | 'slide';
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Stretch to the container width. */
  full?: boolean;
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

// ---- Divider (components/src/core/Divider.d.ts)
export interface DividerProps {
  /** The parent sets the length (a vertical divider between controls): no stretch. */
  fixed?: boolean;
  type?: 'solid' | 'dashed' | 'dotted' | 'strong';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
export declare function Divider(props: DividerProps): JSX.Element;

// ---- Icon (components/src/core/Icon.d.ts)
export interface IconProps {
  /** Lucide glyph name in kebab-case, e.g. "chevron-down". */
  name: string;
  /** Box size in px. Match --icon-xs 12 / --icon-sm 16 / --icon-md 20 / --icon-lg 24. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;

// ---- IconButton (components/src/core/IconButton.d.ts)
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Required — becomes aria-label and the native tooltip. */
  label: string;
  children: React.ReactNode;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

// ---- Label (components/src/core/Label.d.ts)
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: 'default' | 'secondary' | 'section' | 'disabled' | 'field' | 'inherit';
  /** Element to render: 'label' (default) or 'span' for a caption that labels a group. */
  as?: React.ElementType;
  required?: boolean;
}
export declare function Label(props: LabelProps): JSX.Element;

// ---- Logo (components/src/core/Logo.d.ts)
export interface LogoProps {
  /** Full wordmark or the isotype-only "icon-*" cuts. */
  variant?: 'color' | 'positivo' | 'negativo' | 'icon-color' | 'icon-positivo' | 'icon-negativo';
  /** Rendered height in px; width follows the aspect ratio. */
  height?: number;
  /** Optional product lockup label shown after a hairline rule. */
  product?: string;
  /** Path prefix for the SVG files. Defaults to /assets/logos/. */
  base?: string;
  className?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;

// ---- OrbButton (components/src/core/OrbButton.d.ts)
export interface OrbButtonProps extends Omit<ButtonProps, 'variant' | 'iconStart' | 'iconEnd'> {
  /** Glyph inside the orb. Default: a 4-point sparkle. Pass any node (e.g. an arrow Icon), about half the orb in size. */
  icon?: React.ReactNode;
  /** Hover motion of the glyph: 'spin' (quarter turn, default for the sparkle), 'nudge' (2px to the right, default for a custom icon) or 'none'. The orb itself always grows slightly. All motion is dropped under prefers-reduced-motion. */
  motion?: 'spin' | 'nudge' | 'none';
}
export declare function OrbButton(props: OrbButtonProps): JSX.Element;

// ---- SlideButton (components/src/core/SlideButton.d.ts)
export interface SlideButtonProps extends Omit<ButtonProps, 'variant'> {
  /** 'filled' (brand fill, accent slides in) or 'outline' (stroke + label, brand fill slides in). Default 'filled'. */
  appearance?: 'filled' | 'outline';
  /** 'pill' (default) or 'rounded' (the Button radius). */
  shape?: 'pill' | 'rounded';
}
export declare function SlideButton(props: SlideButtonProps): JSX.Element;

// ---- Text (components/src/core/Text.d.ts)
export interface TextProps {
  /** Mirrors the Semantic Typography roles. */
  variant?: 'display' | 'display-metric' | 'metric' | 'h1' | 'h2' | 'h3' | 'h4' | 'body-large' | 'body' | 'body-small' | 'caption' | 'help' | 'code';
  /** Override the rendered element. */
  as?: keyof JSX.IntrinsicElements;
  tone?: 'secondary' | 'tertiary' | 'inverse' | 'disabled' | 'error' | 'success';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Text(props: TextProps): JSX.Element;

// ---- Avatar (components/src/display/Avatar.d.ts)
export interface AvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Image source. Falls back to icon, then initials. */
  src?: string;
  alt?: string;
  initials?: string;
  icon?: React.ReactNode;
  outlined?: boolean;
  /** 'brand' = Afi navy with white initials, for the signed-in user. Default: grey. */
  tone?: 'default' | 'brand';
  className?: string;
}
export declare function Avatar(props: AvatarProps): JSX.Element;

// ---- Badge (components/src/display/Badge.d.ts)
export interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  /** Leading status dot. */
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Badge(props: BadgeProps): JSX.Element;

// ---- Card (components/src/display/Card.d.ts)
export interface CardProps {
  /** Element to render: 'section' (default), 'div' or 'label'. */
  as?: React.ElementType;
  /** 'metric' is the KPI-card treatment used by MetricCard: larger body padding and 12px stack rhythm. */
  variant?: 'default' | 'metric';
  heading?: React.ReactNode;
  supporting?: React.ReactNode;
  /** Trailing header control, usually an IconButton. */
  action?: React.ReactNode;
  /** Footer action row, right-aligned. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
/** v147: one Card. `variant` figure (a figure with a chart, or a tile or feature: MetricCard), meter (MeterCard), trend (KpiTrendCard) or media (MediaCard) draw those cards, which keep their own names. */
export type CardVariantProps =
  | ({ variant: 'figure'; figure?: 'chart' | 'tile' | 'feature' } & Omit<MetricCardProps, 'variant'>)
  | ({ variant: 'meter' } & MeterCardProps)
  | ({ variant: 'trend' } & KpiTrendCardProps)
  | ({ variant: 'media' } & MediaCardProps);
export declare function Card(props: CardProps | CardVariantProps): JSX.Element;

// ---- Chip (components/src/display/Chip.d.ts)
export interface ChipProps {
  label: string;
  /** Applied filter value; renders after a hairline separator. */
  value?: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  className?: string;
}
export declare function Chip(props: ChipProps): JSX.Element;

// ---- MetricCard (components/src/display/MetricCard.d.ts)
export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 'chart' (default), 'tile' (small figure card), 'feature' (card with a progress ring), 'meter' (a figure against a 0 to 100 % target: draws MeterCard, v146) or 'trend' (a figure with its trend line: draws KpiTrendCard, v146). Tile uses unit, footer, highlight, span; feature uses percent, overline, text, chip; meter and trend take the props of MeterCard and KpiTrendCard. */
  variant?: 'chart' | 'tile' | 'feature' | 'meter' | 'trend';
  unit?: React.ReactNode;
  footer?: React.ReactNode;
  highlight?: boolean;
  span?: number;
  overline?: React.ReactNode;
  percent?: number;
  text?: React.ReactNode;
  chip?: React.ReactNode;
  /** "Value being measured". */
  label: React.ReactNode;
  /** Headline figure, pre-formatted ("99.999.999,99 €"). */
  value: React.ReactNode;
  /** Top-right meta beside a clock icon; '' hides it. */
  lastUpdate?: React.ReactNode;
  /** Trend badge text. Omit for no badge. */
  trend?: React.ReactNode;
  /** 'success' (green, up arrow) or 'critical' (red, down arrow). */
  trendTone?: 'success' | 'critical' | 'neutral' | 'info' | 'warning';
  /** Which built-in chart to draw. Default 'line' (area-filled when one series). */
  chartType?: 'line' | 'bar' | 'donut';
  /** Series for the line chart. */
  series?: LineSeries[];
  labels?: string[];
  /** Data for bar and donut charts. */
  data?: BarDatum[] | DonutDatum[];
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
  /** Custom chart node — overrides chartType/series. */
  chart?: React.ReactNode;
  /** Footer left. A string renders as dot + text (dot colour from legendColor); a node renders as-is; omitted derives from series. */
  legend?: React.ReactNode;
  /** Dot colour for the derived footer legend. For bar/donut, setting this shows a "label" legend item. */
  legendColor?: string;
  /** Footer right — "Other data (5 assets)". */
  footerMeta?: React.ReactNode;
}
export declare function MetricCard(props: MetricCardProps): JSX.Element;

// ---- Tag (components/src/display/Tag.d.ts)
export interface TagProps {
  /** category = solid neutral fill; system = dashed boundary on surface. */
  kind?: 'category' | 'system';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function Tag(props: TagProps): JSX.Element;

// ---- Checkbox (components/src/forms/Checkbox.d.ts)
export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

// ---- HelpText (components/src/forms/HelpText.d.ts)
export interface HelpTextProps {
  tone?: 'default' | 'error' | 'success';
  /** The form-field help line: 12/16, no margin, the error line fades and drops in. Input, Select and Textarea use it. */
  field?: boolean;
  /** Margin 0 and the help weight at the default 10/12 size (NumberStepper). */
  tight?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function HelpText(props: HelpTextProps): JSX.Element;

// ---- Input (components/src/forms/Input.d.ts)
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Rings the field while a picker is filling it (DateRange). */
  active?: boolean;
  /** An interactive control at the end of the field (a calendar button). iconEnd is decoration; action can be pressed. */
  action?: React.ReactNode;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  help?: string;
  /** Error message. Sets the error chrome and replaces the help text. */
  error?: string;
  required?: boolean;
  /** Text affix such as "€" or "EUR". */
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
export declare function Input(props: InputProps): JSX.Element;

// ---- NumberStepper (components/src/forms/NumberStepper.d.ts)
export interface NumberStepperProps {
  label?: React.ReactNode;
  /** Controlled value. Pair with onChange. */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number;
  /** Called with the new number (typed values inside min..max, or any committed step / blur / Enter). */
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Step for the chevrons and ArrowUp/Down. Shift and PageUp/PageDown move 10 steps. Default 1. */
  step?: number;
  /** Unit suffix inside the field, e.g. "m²". Also read out in aria-valuetext. */
  unit?: string;
  help?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  id?: string;
  /** Accessible names of the chevron buttons. Defaults "Aumentar" / "Disminuir". */
  incrementLabel?: string;
  decrementLabel?: string;
  'aria-label'?: string;
  className?: string;
}
export declare function NumberStepper(props: NumberStepperProps): JSX.Element;

// ---- Radio (components/src/forms/Radio.d.ts)
export interface RadioProps {
  /** No label of its own: the radio sits inside a larger label (ChoiceCard). */
  bare?: boolean;
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (value?: string) => void;
  id?: string;
  className?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;

// ---- Segment (components/src/forms/Segment.d.ts)
export interface SegmentProps {
  /** 'tab' (default) or 'radio' (inside a radio group). */
  role?: 'tab' | 'radio';
  label: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
export declare function Segment(props: SegmentProps): JSX.Element;

// ---- SegmentedControl (components/src/forms/SegmentedControl.d.ts)
export interface SegmentedOption { value: string; label: string; disabled?: boolean; }
export interface SegmentedControlProps {
  options: SegmentedOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;

// ---- Select (components/src/forms/Select.d.ts)
export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  value?: string;
  placeholder?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  help?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}
export declare function Select(props: SelectProps): JSX.Element;

// ---- Toggle (components/src/forms/Toggle.d.ts)
export interface ToggleProps {
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onChange?: (active: boolean) => void;
  className?: string;
  /** A line of help text under the label, linked to the switch for screen readers. */
  hint?: React.ReactNode;
}
export declare function Toggle(props: ToggleProps): JSX.Element;

// ---- Breadcrumb (components/src/navigation/Breadcrumb.d.ts)
export interface BreadcrumbItem { label: React.ReactNode; href?: string; }
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  type?: 'chevron' | 'slash';
  className?: string;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;

// ---- Menu (components/src/navigation/Menu.d.ts)
export interface MenuProps {
  children?: React.ReactNode;
  className?: string;
}
export declare function Menu(props: MenuProps): JSX.Element;

// ---- MenuDropdown (components/src/navigation/MenuDropdown.d.ts)
export interface MenuDropdownProps {
  /** The element that opens the panel — usually an IconButton or Button. */
  trigger: React.ReactNode;
  align?: 'start' | 'end';
  children?: React.ReactNode;
  className?: string;
}
export declare function MenuDropdown(props: MenuDropdownProps): JSX.Element;

// ---- MenuItem (components/src/navigation/MenuItem.d.ts)
export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The children are the whole content (no icon or label slots). */
  bare?: boolean;
  /** Show the selected check mark at the end. */
  check?: boolean;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Trailing hint — a shortcut or a value. */
  trailing?: React.ReactNode;
  selected?: boolean;
  destructive?: boolean;
}
export declare function MenuItem(props: MenuItemProps): JSX.Element;

// ---- NavItem (components/src/navigation/NavItem.d.ts)
export interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  /** Neutral selected state — background/selected fill, no brand tint or accent bar. */
  selected?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  as?: 'button' | 'a';
  /** A number shown as a neutral badge after the label (e.g. items waiting). On the collapsed rail it sits on the icon corner. */
  count?: number | string;
  /** Spoken with the label when there is a count, e.g. "2 pendientes". Default: the count itself. */
  countLabel?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}
export declare function NavItem(props: NavItemProps): JSX.Element;

// ---- Navbar (retired in v141: a thin wrapper that draws AppHeader; use AppHeader)
export interface NavbarProps {
  /** On a phone (640 px and narrower): 'menu' (default) keeps the title and shows a three-dots button; the centre and the actions open in a bottom sheet. 'inline' keeps everything in the bar. */
  mobile?: 'menu' | 'inline';
  moreLabel?: string;
  layout?: 'desktop' | 'compact' | 'mobile';
  /** Leading zone content — back button, menu button, logo. */
  lead?: React.ReactNode;
  pageLabel?: React.ReactNode;
  /** Center zone, typically the search trigger. */
  center?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}
export declare function Navbar(props: NavbarProps): JSX.Element;

// ---- NavbarSearch (components/src/navigation/NavbarSearch.d.ts)
export interface NavbarSearchProps {
  placeholder?: string;
  shortcut?: string;
  onClick?: () => void;
  className?: string;
}
export declare function NavbarSearch(props: NavbarSearchProps): JSX.Element;

// ---- Sidebar (components/src/navigation/Sidebar.d.ts)
export interface SidebarProps {
  /** Collapses to the 72px rail and centres its contents. */
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;

// ---- SidebarGroup (components/src/navigation/SidebarGroup.d.ts)
export interface SidebarGroupProps {
  /** Section label; hidden when the rail is collapsed. */
  label?: React.ReactNode;
  collapsed?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function SidebarGroup(props: SidebarGroupProps): JSX.Element;

// ---- TabItem (components/src/navigation/TabItem.d.ts)
export interface TabItemProps {
  /** A neutral badge with a count after the label. */
  count?: number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
export declare function TabItem(props: TabItemProps): JSX.Element;

// ---- Tabs (components/src/navigation/Tabs.d.ts)
export interface TabItem { value: string; label: React.ReactNode; icon?: React.ReactNode; disabled?: boolean; }
export interface TabsProps {
  /** The tabs. `options` is the same list (v148: SegmentedControl takes options). */
  items?: TabItem[];
  options?: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;

// ---- Dialog (components/src/overlays/Dialog.d.ts)
export interface DialogProps {
  open?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;

// ---- Drawer (components/src/overlays/Drawer.d.ts)
export interface DrawerProps {
  /** false: the drawer slides 56 px out (300 ms ease-in-out) and unmounts after it. Default true. */
  open?: boolean;
  /** 360 / 480 / 640px. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Drawer(props: DrawerProps): JSX.Element;

// ---- Tooltip (components/src/overlays/Tooltip.d.ts)
export interface TooltipProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Optional keyboard hint rendered after the label. */
  shortcut?: string;
  /** Opt-in enter + exit motion. false (default) = the CSS hover / focus-within fade, unchanged. true: the pill pops in (--mo-dur-out on the spring token, 4 px rise, scale .96, blur 2 px) and leaves with closeWithMotion "pop" (--mo-dur-exit); re-hovering mid-exit reverses it; Escape closes it; reduced motion = instant. */
  motion?: boolean;
  /** Opt-in click-to-pin (implies the `motion` wiring). A click on the anchor toggles the pill pinned open: hover / focus can no longer close it; Escape and a click outside close it with the exit motion (re-hovering mid-exit reverses it). The trigger gets aria-expanded (true while pinned) and the root data-pinned. false (default) = nothing changes; hover / focus behave as before; reduced motion = instant. */
  pinnable?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
/** Wires enter + exit motion on a plain-HTML tooltip root (`.afi-tooltip-v2[data-motion]` or `.afi-tooltip[data-motion]` containing a `[role="tooltip"]`). Opens on mouseenter / focusin, closes on mouseleave / focusout / Escape; sets `data-open` on the root while the pill is shown. With `data-pinnable` on the root (it also sets `data-motion`): a click on the anchor toggles pinned (`data-pinned` on the root, `aria-expanded` on the first focusable child), Escape (anywhere) and a click outside unpin and close it. Returns a cleanup function (removes the listeners and the pinned markers). */
export declare function tooltipMotion(root: Element | null): () => void;

// ---- Table (components/src/table/Table.d.ts)
export interface TableColumn {
  key: string;
  label: React.ReactNode;
  /** Drives alignment and tabular figures. */
  kind?: 'text' | 'numeric' | 'monetary' | 'boolean' | 'action' | 'component';
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  width?: number | string;
  render?: (row: any) => React.ReactNode;
}
export interface TableProps {
  /** On a phone (560 px and narrower): 'scroll' (default) keeps the table, scrolling sideways with the first column pinned; 'cards' shows each row as a card (first data column = title, the others = label and value lines, kind 'action' columns = the card's buttons). Use cards for a table of records you open, scroll for numbers you compare. Sorting is not offered in cards. */
  mobile?: 'scroll' | 'cards';
  columns: TableColumn[];
  rows: any[];
  /** Row height: 32 / 40 / 48px. The header stays 40px. */
  density?: 'compact' | 'default' | 'comfortable';
  selectable?: boolean;
  selected?: Array<string | number>;
  onSelect?: (id: string | number) => void;
  /** Header "select all" toggle. Omit to render the header checkbox inert. */
  onSelectAll?: () => void;
  sort?: { key: string; dir: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  hoverable?: boolean;
  empty?: React.ReactNode;
  className?: string;
}
export declare function Table(props: TableProps): JSX.Element;

// ---- TableCell (components/src/table/TableCell.d.ts)
export interface TableCellProps {
  /** Drives alignment and tabular figures. */
  kind?: 'text' | 'numeric' | 'monetary' | 'boolean' | 'action' | 'component';
  align?: 'start' | 'center' | 'end';
  /** Ellipsize instead of wrapping. */
  truncate?: boolean;
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}
export declare function TableCell(props: TableCellProps): JSX.Element;

// ---- TableHeaderCell (components/src/table/TableHeaderCell.d.ts)
export interface TableHeaderCellProps {
  label: React.ReactNode;
  kind?: 'text' | 'numeric' | 'monetary' | 'boolean' | 'action';
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  /** Current sort direction for this column, or undefined when unsorted. */
  sort?: 'asc' | 'desc';
  onSort?: () => void;
  className?: string;
}
export declare function TableHeaderCell(props: TableHeaderCellProps): JSX.Element;

// ---- TableHeaderRow (components/src/table/TableHeaderRow.d.ts)
export interface TableHeaderRowProps {
  children?: React.ReactNode;
  className?: string;
}
export declare function TableHeaderRow(props: TableHeaderRowProps): JSX.Element;

// ---- TableRow (components/src/table/TableRow.d.ts)
export interface TableRowProps {
  selected?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export declare function TableRow(props: TableRowProps): JSX.Element;

// ---- TableShell (components/src/table/TableShell.d.ts)
export interface TableShellProps {
  density?: 'compact' | 'default' | 'comfortable';
  children?: React.ReactNode;
  className?: string;
}
export declare function TableShell(props: TableShellProps): JSX.Element;

// ---- MeterCard (components/src/display/MeterCard.d.ts)
export interface MeterCardProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  /** Info text: shows an info icon button whose aria-label and title are this text. */
  info?: string;
  onInfoClick?: () => void;
  /** When set, shows the "…" menu button. */
  onMenuClick?: () => void;
  /** aria-label of the menu button. Default "Más opciones". */
  menuLabel?: string;
  /** Headline figure, pre-formatted ("1.284 kWh"). */
  value: React.ReactNode;
  /** Unit shown after the value at about 40 % size in content-secondary ("€", "kWh"). Optional: without it `value` renders as given. */
  unit?: React.ReactNode;
  /** Delta figure beside the value ("+4,5 %"). */
  delta?: React.ReactNode;
  /** Muted text after the delta ("desde el mes pasado"). */
  deltaLabel?: React.ReactNode;
  /** 'good' paints the delta in success-foreground, 'bad' in error-foreground. Default 'good'. */
  deltaTone?: 'good' | 'bad';
  /** 0–100. Fills the meter and sets aria-valuenow. */
  percent: number;
  /** Optional fixed tick count across the full track (only the part past `percent` shows). Default: ticks every 8px (2px tick, 6px gap) to fill the track. */
  ticks?: number;
  /** Text of the full-width summary row under the meter. A button with a chevron when onSummaryClick is set, plain information otherwise. */
  summary?: React.ReactNode;
  onSummaryClick?: () => void;
}
export declare function MeterCard(props: MeterCardProps): JSX.Element;

// ---- KpiTrendCard (components/src/display/KpiTrendCard.d.ts)
export interface KpiTrendPoint {
  index: number;
  /** Value shown in the floating label ("1.240 €"). */
  label?: string;
  /** Date shown under it ("12 oct"). */
  date?: string;
}
export interface KpiTrendCardProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  /** Very large headline figure, pre-formatted. */
  value: React.ReactNode;
  /** Unit shown after the value at about 40 % size in content-secondary ("€", "kWh"). Optional: without it `value` renders as given. */
  unit?: React.ReactNode;
  /** Delta badge text ("+12,4 %"). */
  delta?: React.ReactNode;
  /** Arrow direction in the badge. Default: 'down' when delta starts with "-", else 'up'. */
  direction?: 'up' | 'down';
  /** Colours the badge, the sub figure and the trend: 'good' success, 'bad' error. Independent of direction. */
  tone: 'good' | 'bad';
  period?: React.ReactNode;
  onPeriodClick?: () => void;
  /** Sub line ("+330 hoy"); a leading figure is coloured by tone. */
  sub?: React.ReactNode;
  series: number[];
  /** Marked point with floating label and dashed guide. Default index: the last. */
  point?: KpiTrendPoint;
  /** Overrides the generated aria-label of the chart. */
  chartLabel?: string;
}
export declare function KpiTrendCard(props: KpiTrendCardProps): JSX.Element;

// ---- MediaCard (components/src/display/MediaCard.d.ts)
export interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Footer text on the left, clamped to two lines. */
  caption?: React.ReactNode;
  /** Label of the pill on the right. The pill is NOT a second control: it is a styled span, the whole card is the button. */
  action?: React.ReactNode;
  /** Look of the action: 'pill' (default, primary pill) or 'ghost' (transparent, control radius, arrow after the label; hover fills grey and nudges the arrow). With 'ghost', pass the sentence as `action` and leave `caption` empty. */
  actionStyle?: 'pill' | 'ghost';
  /** Content of the media panel (1.28:1, rounded). Decorative: it is aria-hidden. Usually <DigitArt shape="edificio" />. */
  media?: React.ReactNode;
  /** Passes `loop` to the DigitArt in the media slot (continuous sway). Hover and focus then only raise the digit re-roll rate. Default false. */
  loop?: boolean;
  /** The card's element: 'button' (default, type="button") or 'a' (give it href). */
  as?: 'button' | 'a';
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}
export declare function MediaCard(props: MediaCardProps): JSX.Element;

// ---- Toast (components/src/overlays/Toast.d.ts)
import type { HTMLAttributes, ReactNode } from 'react';
export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible. Toggle this; keep the element mounted so it can leave on ease-out. */
  show?: boolean;
  /** Label of the action button (e.g. "Deshacer"). Omit for a plain message. */
  action?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}
export declare function Toast(props: ToastProps): JSX.Element;

// ---- Reveal (components/src/display/Reveal.d.ts)
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
export interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default `div`. */
  as?: ElementType;
  /** Negative top margin (px) the reveal starts from, to pull the grown block under the previous one. */
  lead?: number;
  /** Px of flex / grid gap around the element. The fold ends at margin-top -gap so the page does not settle by the gap when the node is removed (mirror of `lead` for the leave). Default 0 = exactly the previous fold. */
  gap?: number;
  /** Pixels of outside-the-box effects (focus ring, 4 px selected ring) kept visible at the top and sides while it grows in. Default 0 = clipped to the box exactly as before. For all four sides use padding + equal negative margin instead (see README). */
  outset?: number;
  /** Play the entrance on mount. Default true. */
  play?: boolean;
  /** false: the block FOLDS (height to 0, 450 ms ease-in-out) and unmounts after it; true again re-opens (reverses a fold in progress). Default true. */
  open?: boolean;
  children?: ReactNode;
}
export declare function Reveal(props: RevealProps): JSX.Element | null;
export declare namespace Reveal {
  /** Plays the height + blur spring on any element (plain-HTML pages). Returns the Animation, or null (reduced motion / hidden). */
  function springIn(el: Element | null, opts?: { lead?: number; outset?: number }): Animation | null;
  /** Folds any element (height to 0, 450 ms ease-in-out), then calls onDone. Reduced motion: onDone at once. */
  function foldOut(el: Element | null, opts?: { onDone?: () => void; gap?: number }): Promise<void>;
}

// ---- Exit motion (components/src/overlays/presence.d.ts)
export interface CloseWithMotionOptions {
  /** 'pop' (default: opacity 0, 4 px up, scale .98, blur 2 px), 'slide' / 'slide-left' (56 px out, drawers; auto for .afi-drawer*), 'fade', 'fold' (height to 0, 450 ms). */
  kind?: 'pop' | 'slide' | 'slide-left' | 'fade' | 'fold';
  /** Runs when the exit has finished (or at once under reduced motion): remove the node, dialog.close(), setState... Return focus to the trigger here. */
  onDone?: () => void;
  /** Override the exit duration in ms. */
  duration?: number;
  /** Only for kind 'fold': px of flex / grid gap around the element. The fold ends at margin-top -gap, so the page does not settle by the gap when the node is removed (same idea as Reveal.springIn `lead`). Default 0 = unchanged. */
  gap?: number;
  /** Extra elements animated with the same 'pop' (e.g. the dialog inside its scrim). */
  also?: Array<Element | null>;
}
/** Plays the leave animation (300 ms ease-in-out, --mo-dur-exit / --mo-ease-exit), THEN calls onDone. Sets data-state="closing" and data-motion-js; the DS CSS gives `[data-motion-js][data-state=closing]` pointer-events: none, so pages need no rule of their own. Idempotent while closing. */
export declare function closeWithMotion(el: Element | null, opts?: CloseWithMotionOptions): Promise<void>;
/** Call when the node is shown again while it is still closing: reverses the running exit from where it is (no jump). No-op otherwise. */
export declare function openWithMotion(el: Element | null): Promise<void>;
/** React: keep a node mounted until its exit has finished. `const { mounted } = usePresence(open, ref, { kind })`, render the node while `mounted`. */
export declare function usePresence(open: boolean, ref: React.RefObject<Element>, opts?: { kind?: CloseWithMotionOptions['kind']; also?: Array<React.RefObject<Element>> }): { mounted: boolean; closing: boolean };

// ---- AppHeader (components/src/navigation/AppHeader.d.ts)
export interface AppHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Brand mark: an <svg> or <img> element. It gets .afi-app-header__logo (height 22 px, ratio --app-logo-ratio) and aria-hidden: the accessible name comes from `name` or `brandLabel`. */
  logo?: React.ReactNode;
  /** Product name next to the logo, after a hairline separator ("Sarevi"). */
  name?: React.ReactNode;
  /** Makes the brand a link (<a href>); without it the brand is a <button type="button"> (use onBrandClick). */
  brandHref?: string;
  onBrandClick?: React.MouseEventHandler<HTMLElement>;
  /** aria-label of the brand button / link (needed when there is only a logo). */
  brandLabel?: string;
  /** The left side as your own node (a menu button and a logo, a page title). Replaces the logo and name brand button. */
  lead?: React.ReactNode;
  /** Middle slot: a search. The stepper is not here: it is StepperBar, the bar below the header. */
  middle?: React.ReactNode;
  /** 'start' (default): the middle sits next to the brand. 'center': it takes the free space and centres. */
  middleAlign?: 'start' | 'center';
  /** On a phone (640 px and narrower): 'inline' (default) keeps everything in the bar; 'menu' folds the middle and the end into a three-dots menu. */
  mobile?: 'inline' | 'menu';
  moreLabel?: string;
  /** End slot: reference code (<CopyCode>), a button... */
  end?: React.ReactNode;
  /** Deprecated since v141, ignored: the stepper is not in the header (use StepperBar). */
  flow?: boolean;
  /** Translucent blurred bar once the page has scrolled under it; the page toggles it. Default false. */
  stuck?: boolean;
}
export declare function AppHeader(props: AppHeaderProps): JSX.Element;

// ---- Stepper (components/src/navigation/Stepper.d.ts)
export interface StepperProps extends Omit<React.OlHTMLAttributes<HTMLOListElement>, 'children'> {
  /** Step labels in order. */
  steps?: React.ReactNode[];
  /** 1-based current step: it gets aria-current="step"; earlier steps show a check. */
  current?: number;
  /** Furthest step the person has reached (1-based). Steps up to max(reached, current - 1) other than the current one become buttons. */
  reached?: number;
  /** Called with the 1-based step when a reached step is clicked. */
  onStep?: (step: number) => void;
  /** aria-label of the wrapping <nav> landmark. Default "Progreso". */
  label?: string;
}
/** Steps as an <ol> inside a <nav aria-label> landmark. Advancing `current` plays the stepper motion (connector fill, number to check on the spring, ring on the new step); none under reduced motion. */
export declare function Stepper(props: StepperProps): JSX.Element;
/** Plays the advance motion on any `<ol class="afi-stepper(-v2)">` (plain-HTML pages): stepperAdvance(ol, prevStep, nowStep). No-op unless now > prev or under reduced motion. */
export declare function stepperAdvance(root: Element | null, prev: number, now: number): void;
export interface StepperBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** End slot (reference code, a button...). */
  end?: React.ReactNode;
  /** Phone only (<= 640 px): true fades the bar out and lifts it 8 px (exit tokens; its layout box stays, keyboard focus inside brings it back) so StepProgress can take its place; false keeps it. Renders data-compact="true|false". Omit it for a bar that never compacts (no attribute). */
  compact?: boolean;
  /** Same glass as the stuck AppHeader (--bar-glass-background / --bar-glass-filter: surface at 72% + blur 14px + saturate) once the page has scrolled under the bar; the page toggles it, like AppHeader `stuck`. Default false: the resting bar keeps its control-background 90% surface. */
  stuck?: boolean;
  /** v148: draws the compact phone progress bar (StepProgress) with the bar: { step, total, title, countText?, phoneOnly? }. It is shown while `compact` is true. StepProgress keeps its name. */
  progress?: { step: number; total?: number; title?: React.ReactNode; countText?: React.ReactNode; phoneOnly?: boolean };
}
/** The stepper as its own bar below the app header: translucent blurred surface (control-background-default 90% + backdrop blur, like the stuck AppHeader), bottom hairline, sticky at `--stepper-bar-top` (default `calc(var(--ctl-h, 0px) + var(--hdr-h, 0px))`, z-index just under the header). Above 640 px the `children` (a <Stepper>) are centred (grid 1fr auto 1fr) and `end` stays at the end; under 640 px it wraps. */
export declare function StepperBar(props: StepperBarProps): JSX.Element;
export interface AppBarsOffsetOptions {
  /** Element that receives --hdr-h and --sh-h. Default document.documentElement. */
  target?: HTMLElement;
}
export interface AppBarsOffset {
  /** Height of the AppHeader (px). */
  hdr: number;
  /** Height of the bar under it: the StepperBar, or on a phone the StepProgress bar once it has replaced it (data-visible="true" or the StepperBar data-compact="true"). */
  bar: number;
  /** hdr + bar. */
  sh: number;
}
/** Measures the sticky app bars once under `root` (default document) and publishes `--hdr-h` (header height) and `--sh-h` (header + the bar showing under it) on `target`. Looks for `.afi-app-header(-v2)`, `.afi-stepper-bar(-v2)` and `.afi-step-progress(-v2)__bar`. `--ctl-h` (a page's own control strip) is not touched. CSS cannot know these heights (the header wraps on phones), so this is the JS half of the --sh-h contract. */
export declare function appBarsOffset(root?: ParentNode | null, opts?: AppBarsOffsetOptions): AppBarsOffset;
/** appBarsOffset kept up to date: ResizeObserver on the bars, MutationObserver for data-compact / data-visible and re-rendered bars, window resize. Runs once now. Returns a stop function; `stop.update()` re-measures synchronously. */
export declare function observeAppBars(root?: ParentNode | null, opts?: AppBarsOffsetOptions): { (): void; update: () => AppBarsOffset };

// ---- StepProgress (components/src/navigation/StepProgress.d.ts)
export interface StepProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 1-based current step (clamped to 1..total). */
  step?: number;
  /** Number of steps / segments. Default 3. */
  total?: number;
  /** Current step name (bold, start side). */
  title?: React.ReactNode;
  /** Replaces the default "Paso X de N" text. */
  countText?: string;
  /** true: the bar slides in (spring tokens); false: it slides out (exit tokens). Default false. Drive it from scrollThreshold / useScrollThreshold. */
  visible?: boolean;
  /** Only show at 640 px and narrower (default true). false: show at every width. */
  phoneOnly?: boolean;
}
/** Compact phone progress bar: zero-height sticky wrapper (offset `--step-progress-top`, default --ctl-h + --hdr-h) with step name, "Paso X de N" and a segmented strip. aria-hidden: it repeats the Stepper. */
export declare function StepProgress(props: StepProgressProps): JSX.Element;
export interface ScrollThresholdOptions {
  /** Scroll offset (px) above which it turns on. Default 80. */
  on?: number;
  /** Scroll offset (px) under which it turns off again. Default 24. */
  off?: number;
  /** Scroll container. Default window. */
  target?: Window | Element;
}
/** Framework-free scroll hysteresis: calls onChange(true) once scrollY passes `on`, onChange(false) once it is back under `off`. Evaluates once at start. Returns a stop function; `stop.sync()` re-evaluates. */
export declare function scrollThreshold(onChange: (on: boolean) => void, opts?: ScrollThresholdOptions): { (): void; sync: () => void };
/** React hook over scrollThreshold. `enabled: false` forces false. */
export declare function useScrollThreshold(opts?: ScrollThresholdOptions & { enabled?: boolean }): boolean;

// ---- ActionBar (components/src/navigation/ActionBar.d.ts)
export interface ActionBarSummary {
  /** Small caption above the value ("Total tras ayudas"). */
  label: React.ReactNode;
  /** The figure (tabular numerals). Shown as "—" while `empty`. */
  value: React.ReactNode;
  /** Line under the value ("Etiqueta E → B"). May hold inline chips; laid out as a flex row with a 6 px gap. */
  note?: React.ReactNode;
  /** Note shown instead of `note` while `empty` ("Marca al menos una medida"). */
  emptyNote?: React.ReactNode;
}
export interface ActionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'> {
  /** 'pill' = the desktop bar: a centred floating rounded pill holding `children`, `secondary` and `primary` (shows above 768 px only; use `<ActionBar.Separator />` for the divider). Without it: the phone summary bar. */
  variant?: 'summary' | 'pill';
  /** Running summary on the start side. */
  summary?: ActionBarSummary;
  /** Empty state: value "—", `emptyNote`, and the primary button gets disabled. */
  empty?: boolean;
  /** The one filled action (a <Button>), end side. */
  primary?: React.ReactNode;
  /** Optional secondary action, before the primary. */
  secondary?: React.ReactNode;
  /** true: slides down and fades out (exit tokens), takes no pointer input. It also hides itself under any open <dialog> (body:has(dialog[open])). Hook for other modals: data-hidden="true". */
  hidden?: boolean;
  /** Spring entrance on mount. Default true. */
  enter?: boolean;
  /** Only show at 640 px and narrower (default true). */
  phoneOnly?: boolean;
  /** aria-label of the group. Default "Acciones". */
  label?: string;
}
/** Sticky phone bottom bar: summary (label, value, note) + primary action. Sticky at the bottom of its container, safe-area padding, spring entrance, hides under modals. */
export declare function ActionBar(props: ActionBarProps): JSX.Element;
export declare namespace ActionBar { function Separator(): JSX.Element; }

// ---- AppFooter (components/src/navigation/AppFooter.d.ts)
export interface AppFooterProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Optional LEFT slot ("Recuperar simulación"). Not rendered unless given. */
  action?: React.ReactNode;
  /** Optional centred brand mark (<svg> / <img>): it gets .afi-app-footer__logo. */
  brand?: React.ReactNode;
  /** Privacy policy / legal notice / cookies: anchors or buttons with class .afi-app-footer__link. Wrapped in <nav aria-label={linksLabel}>, shown in the right column above `legal`. */
  links?: React.ReactNode;
  /** aria-label of the links <nav>. Default "Información legal". */
  linksLabel?: string;
  /** Disclaimer text, 12 px, right column. */
  legal?: React.ReactNode;
}
/** Footer of slots: action | brand | links + legal. Canvas fill, 1 px hairline on top, no gradient. One column, centred, under 640 px. */
export declare function AppFooter(props: AppFooterProps): JSX.Element;

// ---- CopyCode (components/src/forms/CopyCode.d.ts)
export interface CopyCodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The reference code to show and copy. */
  code: string;
  /** Text before the code. Default "Código de referencia" (visually hidden under 1100 px inside a flow AppHeader). */
  label?: string;
  /** Button label before / after copying. Defaults "Copiar" / "Copiado". */
  copyLabel?: string;
  copiedLabel?: string;
  /** Live-region message read out after copying. Default "Código copiado". */
  copiedMessage?: string;
  /** Called with true after a successful copy, false when the clipboard is not available. */
  onCopy?: (ok: boolean) => void;
}
/** Reference code + ghost "Copiar" button. After copying, the icon and label swap to "Copiado" (blur-in on the spring) for 1.5 s; a polite live region announces it. */
export declare function CopyCode(props: CopyCodeProps): JSX.Element;
/** Plays the Copiar / Copiado swap on any `.afi-copy-code(-v2)` element (plain-HTML pages): copyCodeSwap(el, copied). */
export declare function copyCodeSwap(root: Element | null, copied: boolean): void;

// ---- EnergyLabel (components/src/feedback/EnergyLabel.d.ts)
export interface EnergyLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Grade letter A-G; it picks the regulatory colour (--energy-a ... --energy-g). Default "A". */
  grade?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  /** xs 13 px (preview scale), sm 32 px, md 40 px ("Ahora"), lg 52 px (the grade after the reform). Default "md". Always a rounded square. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Dimmed: transparent, 42% opacity, no colour (the scale fillers). */
  muted?: boolean;
  /** Keeps the grade colour but at 42% opacity (the unselected letters of a preview scale). */
  dim?: boolean;
  /** Passing a boolean makes the chip a selectable radio (a <button role="radio" aria-checked>): unselected 55%, selected 100% with a ring and a spring pop. Put several in a role="radiogroup" and handle onClick yourself. */
  checked?: boolean;
}
/** The A-G grade as a square chip in the regulatory colour. */
export declare function EnergyLabel(props: EnergyLabelProps): JSX.Element;
export interface EnergyScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grade the person has now: md square, outlined, captioned `fromLabel`. */
  from?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  /** Grade after the reform: lg square, springs in, captioned `toLabel`. */
  to?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  /** Caption under `from`. Default "Ahora". */
  fromLabel?: string;
  /** Caption under `to`. Default "Tras la reforma". */
  toLabel?: string;
  /** aria-label of the role="img" row. Default "Pasas de la etiqueta X a la Y". */
  label?: string;
}
/** A-G in a row: `from` and `to` lit, the other letters dimmed and blurred by distance from `to`. Entrance: letters fade, `to` pops on the spring. */
export declare function EnergyScale(props: EnergyScaleProps): JSX.Element;
/** Exit for an EnergyScale (or any element holding .afi-energy-label): each letter pops 14% then shrinks and blurs away on the spring, staggered from the far end. Resolves when finished (at once under reduced motion); remove the node after it. */
export declare function energyScaleLeave(root: Element | null, selector?: string): Promise<void>;

/* ===== Added 2026-11-13 (chat): Sarevi primitives and React versions of the plain-HTML v2 components ===== */
/** Anchored panel opened by `trigger` (a React element). Esc / outside click closes and refocuses the trigger; bottom sheet under 560px. */
export declare function Popover(props: { trigger: React.ReactElement; title?: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode; footer?: React.ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; align?: 'start' | 'end'; width?: string; closeLabel?: string } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** Blurs its children and shows a spinner + label while `busy`; aria-busy, content inert. */
export declare function LoadingOverlay(props: { busy?: boolean; label?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** A figure that counts to its new value (--motion-duration-move, ease-out), tabular figures; screen readers get the final value. */
export declare function AnimatedNumber(props: { value: number; decimals?: number; format?: (v: number) => string; duration?: number; prefix?: React.ReactNode; suffix?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** One figure as a pill bar on a tick track. tone "before" grey, "after" Afi blue gradient. */
export declare function MeterPill(props: { value: number; max?: number; label?: React.ReactNode; tone?: 'before' | 'after'; ariaLabel?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** Sticks under the app header (--hdr-h + --sh-h); class is-stuck and onStuckChange while stuck. */
/** <details> disclosure; tone "info" = blue help tint; same `name` = one open at a time. */
export declare function Accordion(props: { summary: React.ReactNode; children?: React.ReactNode; tone?: 'default' | 'info'; name?: string; open?: boolean; defaultOpen?: boolean; onToggle?: (open: boolean, e: React.SyntheticEvent) => void } & React.DetailsHTMLAttributes<HTMLDetailsElement>): JSX.Element;
/** Quiet note with an info icon; tone "error" for a blocking problem. */
export declare function Callout(props: { title?: React.ReactNode; children?: React.ReactNode; tone?: 'default' | 'error'; icon?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** Says why a place is empty and what to do next. Level by props: title only = ghost; + icon = ghost with Afi blue tile; + illustration = 3D object. */
export declare function EmptyState(props: { title: React.ReactNode; children?: React.ReactNode; icon?: string; illustration?: 'sello' | 'registro' | 'lupa' | 'escudo' | 'contactos' | 'historico' | 'nuevo' | 'bandeja' | 'plantillas' | 'error' | (string & {}); src?: string; assetBase?: string; actions?: React.ReactNode; size?: 'full' | 'compact'; headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 } & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>): JSX.Element;
/** Page controls for a long list: range text, Anterior / Página x de y / Siguiente. total + page + pageSize in, onPageChange out. */
export declare function Pagination(props: { total: number; page: number; pageSize?: number; onPageChange?: (page: number) => void; labels?: { nav?: string; range?: (from: number, to: number, total: number) => string; page?: (page: number, pages: number) => string; prev?: string; next?: string } } & Omit<React.HTMLAttributes<HTMLElement>, 'onChange'>): JSX.Element;
/** A file already chosen or attached: icon, name, size and an optional destructive Quitar. Flat grey, so it never reads as an input. */
export declare function FileChip(props: { name: string; meta?: string; onRemove?: () => void; removeLabel?: string; icon?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** One month as a grid of days: a date or a range, range preview on hover, full keyboard support, min / max. onPick(date) says which day was chosen. */
export declare function Calendar(props: { start?: Date | null; end?: Date | null; month?: Date; onMonthChange?: (month: Date) => void; onPick?: (date: Date) => void; min?: Date; max?: Date; today?: Date; locale?: string; weekStart?: number; autoFocus?: boolean; labels?: { prev?: string; next?: string } } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>): JSX.Element;
/** Desde / Hasta as two text fields (dd/mm/aaaa) with a calendar panel and shortcuts. onChange({ start, end }) fires on a valid typed or picked date. */
export declare function DateRange(props: { start?: Date | null; end?: Date | null; onChange?: (range: { start: Date | null; end: Date | null }) => void; min?: Date; max?: Date; today?: Date; locale?: string; presets?: boolean | Array<{ label: string; range: () => [Date, Date] }>; fromLabel?: string; toLabel?: string; labels?: Record<string, string> } & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>): JSX.Element;
interface ComparisonMeterRow { label: React.ReactNode; value: React.ReactNode; unit?: React.ReactNode; amount: number }
/** Before / after figures over two segment bars on one scale; "after" steps through the Afi blue gradient. */
export declare function ComparisonMeter(props: { before?: ComparisonMeterRow; after?: ComparisonMeterRow; segments?: number; /** "segments" (default) or "pill": two pill bars with the figure inside the fill. */ shape?: 'segments' | 'pill' } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** Text action: <a> with href, else <button>; inline removes padding. */
export declare function Link(props: { href?: string; inline?: boolean; /** A navigation link that reads as plain text (Breadcrumb): secondary colour, underline on hover. */ quiet?: boolean; /** v149: 'sm' (13 px), 'md' (14 px) or 'lg' (16 px). Nothing changes unless set: a standalone link is sm; an inline or quiet link takes the size of its text. */ size?: 'sm' | 'md' | 'lg'; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;
/** "Question? Link" line; the link is Afi blue. */
/** The one highlighted product offer on a page: action-colour frame, band, optional title. */
export declare function OfferCard(props: { band?: React.ReactNode; title?: React.ReactNode; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;
/** Equal segments for the parts of one step ("Paso 1 de 2"). */
export declare function ProgressSegments(props: { total?: number; done?: number; label?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
/** Fieldset of native radios with a legend; stacked or horizontal. */
export declare function RadioGroup<T extends string | number>(props: { /** Tighter space between options. */ dense?: boolean; legend?: React.ReactNode; name?: string; options: Array<T | { value: T; label: React.ReactNode; disabled?: boolean }>; value?: T; defaultValue?: T; onChange?: (value: T) => void; horizontal?: boolean; disabled?: boolean }): JSX.Element;
/** Phone bar that opens a collapsed panel or sheet; chevron turns when expanded. */
export declare function SheetBar(props: { text: React.ReactNode; expanded?: boolean; controls?: string; onClick?: React.MouseEventHandler } & React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element;
/** Labelled range with an editable value chip; typed values clamp to min..max and round to step. */
export declare function Slider(props: { label: React.ReactNode; min?: number; max?: number; step?: number; value?: number; defaultValue?: number; onChange?: (value: number) => void; unit?: string; format?: (v: number) => string; minLabel?: React.ReactNode; maxLabel?: React.ReactNode }): JSX.Element;
/** Boxed label / amount rows ending in a total. */
export declare function SummaryList(props: { rows: Array<{ label: React.ReactNode; value: React.ReactNode; total?: boolean }> } & React.HTMLAttributes<HTMLDListElement>): JSX.Element;
/** LineChart additions: `interactive`, `formatValue`, `chartLabel`; series items take `name` and `dashed`. LegendItem / LegendItemLine take `dashed`. */

/* ===== 2026-11-13, round 2: Sarevi markup ===== */
/** Badge: size "sm" 20px (on its own) | "md" 24px (in a row of Tags). dot defaults to false. */
export declare function Badge(props: { tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info'; size?: 'sm' | 'md'; dot?: boolean; children?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** Card adds interactive (hover lift + press) and subtle (lighter border). */
export declare function Card(props: { variant?: 'default' | 'metric'; interactive?: boolean; subtle?: boolean; heading?: React.ReactNode; supporting?: React.ReactNode; action?: React.ReactNode; footer?: React.ReactNode; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;
/** Drawer on a native modal dialog; side "left" slides from the start; description under the title. */
export declare function Drawer(props: { open?: boolean; size?: 'sm' | 'md' | 'lg'; side?: 'right' | 'left'; title?: React.ReactNode; description?: React.ReactNode; footer?: React.ReactNode; onClose?: () => void; children?: React.ReactNode } & React.DialogHTMLAttributes<HTMLDialogElement>): JSX.Element;
/** Tooltip placement defaults to "auto" (top, bottom, right, left: whichever fits). */
export declare function Tooltip(props: { content: React.ReactNode; placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right'; shortcut?: string; motion?: boolean; pinnable?: boolean; children?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** Places a tooltip root (.afi-tooltip-v2 with a [role=tooltip] child) on the side that fits. */
export declare function placeTooltip(root: Element | null): void;
/** MediaCard adds layout "horizontal" (media left, text right). */
export declare function MediaCard(props: { title: React.ReactNode; subtitle?: React.ReactNode; caption?: React.ReactNode; action?: React.ReactNode; actionStyle?: 'pill' | 'ghost'; media?: React.ReactNode; layout?: 'vertical' | 'horizontal'; loop?: boolean; as?: 'button' | 'a'; href?: string } & React.HTMLAttributes<HTMLElement>): JSX.Element;
/** Table rows take highlighted: true for a grey total row. */
/** Minimal 3D model (edificio | vivienda): white at rest, trees grow and colour fades in when its card is hovered or focused, or active. Decorative unless label is given. */
export declare function PropertyModel(props: { type?: 'edificio' | 'vivienda' | 'piso' | 'adosado' | 'chalet' | 'bloque' | 'bloqueLocales'; active?: boolean; label?: string } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** Tag: kind "category" | "system"; level 1-3 draws the impact bars. */
export declare function Tag(props: { kind?: 'category' | 'system'; level?: 1 | 2 | 3; icon?: React.ReactNode; children?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>): JSX.Element;
/** Icon size: a step of the --icon-* scale ("xs" 12, "sm" 16, "md" 20, "lg" 24, "xl" 32) or a number of px. Icon.sizes lists the scale. */
export declare function Icon(props: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number; strokeWidth?: number } & React.SVGAttributes<SVGSVGElement>): JSX.Element;

/* ===== Patterns (2026-11-13) ===== */
export declare function ChoiceCard<T>(props: { title: React.ReactNode; help?: React.ReactNode; media?: React.ReactNode; value: T; checked?: boolean; name?: string; onChange?: (v: T) => void; disabled?: boolean }): JSX.Element;
export declare function ChoiceCardGroup<T>(props: { label: string; name?: string; options: Array<{ value: T; title: React.ReactNode; help?: React.ReactNode; media?: React.ReactNode; disabled?: boolean }>; value?: T; onChange?: (v: T) => void; columns?: number }): JSX.Element;
export declare function PreviewPanel(props: { /** The panel's own actions (the primary button), bottom right inside the card. */ actions?: React.ReactNode; title?: React.ReactNode; live?: React.ReactNode; empty?: React.ReactNode; note?: React.ReactNode; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function PreviewLayout(props: { main: React.ReactNode; panel?: React.ReactNode; actions?: React.ReactNode; mobile?: 'stack' | 'sheet'; sheetSummary?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function OfferCard(props: { band?: React.ReactNode; intro?: React.ReactNode; title?: React.ReactNode; children?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;
export declare function FinancingBento(props: { tiles: Array<{ label: React.ReactNode; value: React.ReactNode; unit?: React.ReactNode; footer?: React.ReactNode; span?: number; highlight?: boolean }>; feature?: { overline?: React.ReactNode; percent: number; label?: string; text?: React.ReactNode; chip?: React.ReactNode }; note?: React.ReactNode; busy?: boolean; busyLabel?: string }): JSX.Element;
/** PreviewPanel also takes busy / busyLabel: everything under the title blurs with the spinner. */
export declare function ResumenHero(props: { label?: React.ReactNode; value: React.ReactNode; unit?: React.ReactNode; foot?: React.ReactNode; from?: string; to?: string; gradeTitle?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;
export declare function ComparisonCard(props: { title: React.ReactNode; value: React.ReactNode; caption?: React.ReactNode; before: { label: React.ReactNode; value: React.ReactNode; unit?: React.ReactNode; amount: number }; after: { label: React.ReactNode; value: React.ReactNode; unit?: React.ReactNode; amount: number } } & React.HTMLAttributes<HTMLElement>): JSX.Element;
export declare function ResultsRow(props: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>): JSX.Element;
export declare function LandingHero(props: { eyebrow?: React.ReactNode; title: React.ReactNode; lead?: React.ReactNode; steps?: Array<{ title: React.ReactNode; description?: React.ReactNode }>; question?: React.ReactNode; children?: React.ReactNode; footer?: React.ReactNode } & React.HTMLAttributes<HTMLElement>): JSX.Element;

// ---- v91 (2026-11-16) ----
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  /** A message: turns the field red, sets aria-invalid and is announced as an alert. */
  error?: React.ReactNode;
  required?: boolean;
  rows?: number;
}
export declare function Textarea(props: TextareaProps): JSX.Element;

export interface FileDropProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Fires with the chosen or dropped files. */
  onFiles?: (files: File[]) => void;
  /** Replaces the default "Arrastre un archivo o examine". */
  children?: React.ReactNode;
}
export declare function FileDrop(props: FileDropProps): JSX.Element;

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Id of the main content, default "#contenido". */
  href?: string;
}
export declare function SkipLink(props: SkipLinkProps): JSX.Element;

export interface ShellFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The bar: a node, or a function that receives { menuButton, small } so it can place the hamburger. */
  bar?: React.ReactNode | ((ctx: { menuButton: React.ReactNode; small: boolean }) => React.ReactNode);
  /** The rail, usually a Sidebar. Hidden under `breakpoint`; the menuButton opens it in a left Drawer. */
  rail?: React.ReactNode;
  railTitle?: string;
  menuLabel?: string;
  /** Viewport width under which the rail becomes a drawer. Default 960. */
  breakpoint?: number;
  /** Centre the card in a 720 px column (a supplier-facing flow). */
  narrow?: boolean;
  /** Optional (v163). Lets the page own the menu: true shows the drawer. Leave it out and the frame keeps its own state. */
  menuOpen?: boolean;
  /** Called with true or false when the user opens or closes the menu. */
  onMenuOpenChange?: (open: boolean) => void;
  skipLabel?: string;
  /** id of the <main> element, default "contenido". */
  mainId?: string;
  children?: React.ReactNode;
}
export declare function ShellFrame(props: ShellFrameProps): JSX.Element;

// ---- New atoms (v103)
export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** xs 12, sm 16 (default, takes the text colour), lg 40 (brand colour, for overlays). */
  size?: 'xs' | 'sm' | 'lg';
}
export declare function Spinner(props: SpinnerProps): JSX.Element;

export interface SpinButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** +1 (up) or -1 (down). */
  dir?: 1 | -1;
  label: string;
  /** Called with dir on press, then again every 80 ms after 400 ms of holding. */
  onStep?: (dir: 1 | -1) => void;
}
export declare function SpinButton(props: SpinButtonProps): JSX.Element;

export interface StepLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export declare function StepLink(props: StepLinkProps): JSX.Element;

export interface FieldTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export declare const FieldTrigger: React.ForwardRefExoticComponent<FieldTriggerProps & React.RefAttributes<HTMLButtonElement>>;

export interface KbdProps extends React.HTMLAttributes<HTMLSpanElement> {}
export declare function Kbd(props: KbdProps): JSX.Element;

export interface ButtonFaceProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
export declare function ButtonFace(props: ButtonFaceProps): JSX.Element;

export interface LoadingLayerProps {
  busy?: boolean;
  label?: string;
  className?: string;
}
export declare function LoadingLayer(props: LoadingLayerProps): JSX.Element;

// ---- New atoms (v107)
export interface PlainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 'a' renders a link (a card or brand that is a link or a button). Default: a <button type="button">. */
  as?: 'a';
  href?: string;
}
export declare const PlainButton: React.ForwardRefExoticComponent<PlainButtonProps & React.RefAttributes<HTMLElement>>;

export interface SlideIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Position and width in px, measured by the parent. */
  box: { left: number; width: number };
  /** underline: a 2px line along the bottom edge (Tabs); pill: a rounded fill behind the item (SegmentedControl). */
  variant?: 'underline' | 'pill';
  /** Slide to the new position (off under reduced motion). */
  animate?: boolean;
}
export declare function SlideIndicator(props: SlideIndicatorProps): JSX.Element;

export interface SeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {}
export declare function Separator(props: SeparatorProps): JSX.Element;

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** inverse: a translucent white fill and white text, for a dark surface (default). */
  tone?: 'inverse';
}
export declare function Pill(props: PillProps): JSX.Element;

export interface DotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Any CSS colour or var(). */
  color?: string;
}
export declare function Dot(props: DotProps): JSX.Element;

export interface SparklineProps {
  /** Line path in a 0..100 box. */
  d: string;
  from: number;
  to: number;
  /** Unique gradient id. */
  gid: string;
  /** primary (chart colour, default), good (success) or bad (error). */
  tone?: 'primary' | 'good' | 'bad';
}
export declare function Sparkline(props: SparklineProps): JSX.Element;

export interface ProgressRingProps {
  /** 0 to 100. */
  pct: number;
  label?: string;
  arcClass?: string;
}
export declare function ProgressRing(props: ProgressRingProps): JSX.Element;

export interface PopoverPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  align?: 'start' | 'end';
  width?: string | number;
  title?: React.ReactNode;
  titleId?: string;
  onClose?: () => void;
  closeLabel?: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  /** No body wrapper around the children. */
  bare?: boolean;
}
export declare const PopoverPanel: React.ForwardRefExoticComponent<PopoverPanelProps & React.RefAttributes<HTMLDivElement>>;

// ---- The server wait (v111)
/** Holds the previous result while a new one arrives: { value, busy }. delay in ms (default 1200); reduced motion: no wait. */
export declare function useLiveResult<I, R>(input: I, compute: (input: I) => R, options?: { delay?: number }): { value: R; busy: boolean };
/** The server wait is always the spinner. `variant` on LoadingOverlay and LoadingLayer and `busyVariant` on PreviewPanel are accepted and ignored (the loader bar was retired in v135). */

// ---- Chart patterns (v140)
/** Turn the Patrones setting on or off for every chart on the page (remembered in the browser). */
export declare function setChartPatterns(on: boolean): void;
/** The current Patrones setting (a chart's own `patterns` prop wins when it is true or false). */
export declare function useChartPatterns(prop?: 'auto' | boolean): boolean;

// v158: families. One component per kind of thing; `type` picks the variant (the variant names on its card, in camelCase). The old names still work.
export declare const Bar: React.ForwardRefExoticComponent<{ type?: "action" | "footer" | "header" | "sheet" } & Record<string, any>> & { types: string[] };
export declare const Chart: React.ForwardRefExoticComponent<{ type?: "bar" | "compare" | "donut" | "legend" | "line" | "ring" | "sparkline" | "stacked" } & Record<string, any>> & { types: string[] };
export declare const Control: React.ForwardRefExoticComponent<{ type?: "checkbox" | "radio" | "radioGroup" | "segment" | "segmentedControl" | "toggle" } & Record<string, any>> & { types: string[] };
export declare const Energy: React.ForwardRefExoticComponent<{ type?: "label" | "scale" } & Record<string, any>> & { types: string[] };
export declare const Field: React.ForwardRefExoticComponent<{ type?: "copyCode" | "fieldTrigger" | "helpText" | "input" | "label" | "numberStepper" | "select" | "slider" | "numberArrows" | "spinButton" | "textarea" } & Record<string, any>> & { types: string[] };
export declare const File: React.ForwardRefExoticComponent<{ type?: "chip" | "drop" } & Record<string, any>> & { types: string[] };
export declare const Loading: React.ForwardRefExoticComponent<{ type?: "layer" | "overlay" | "spinner" } & Record<string, any>> & { types: string[] };
export declare const Navigation: React.ForwardRefExoticComponent<{ type?: "breadcrumb" | "menu" | "menuDropdown" | "navItem" | "pagination" | "sidebar" | "skipLink" | "tabs" } & Record<string, any>> & { types: string[] };
export declare const Notification: React.ForwardRefExoticComponent<{ type?: "callout" | "toast" } & Record<string, any>> & { types: string[] };
export declare const Preview: React.ForwardRefExoticComponent<{ type?: "layout" | "panel" } & Record<string, any>> & { types: string[] };
export declare const Shell: React.ForwardRefExoticComponent<{ type?: "frame" } & Record<string, any>> & { types: string[] };
