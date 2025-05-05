
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DateRangePickerProps {
  startMonth: number;
  endMonth: number;
  onStartMonthChange: (value: number) => void;
  onEndMonthChange: (value: number) => void;
}

const months = [
  { value: 0, label: 'Jan' },
  { value: 1, label: 'Feb' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Apr' },
  { value: 4, label: 'May' },
  { value: 5, label: 'Jun' },
  { value: 6, label: 'Jul' },
  { value: 7, label: 'Aug' },
  { value: 8, label: 'Sep' },
  { value: 9, label: 'Oct' },
  { value: 10, label: 'Nov' },
  { value: 11, label: 'Dec' }
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="w-full sm:w-1/2">
        <Label htmlFor="start-month" className="text-sm font-medium mb-1.5 block">
          Start Month
        </Label>
        <Select 
          value={startMonth.toString()} 
          onValueChange={(value) => onStartMonthChange(parseInt(value))}
        >
          <SelectTrigger id="start-month" className="w-full">
            <SelectValue placeholder="Select start month" />
          </SelectTrigger>
          <SelectContent>
            {months.filter(month => month.value <= endMonth).map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-1/2">
        <Label htmlFor="end-month" className="text-sm font-medium mb-1.5 block">
          End Month
        </Label>
        <Select 
          value={endMonth.toString()} 
          onValueChange={(value) => onEndMonthChange(parseInt(value))}
        >
          <SelectTrigger id="end-month" className="w-full">
            <SelectValue placeholder="Select end month" />
          </SelectTrigger>
          <SelectContent>
            {months.filter(month => month.value >= startMonth).map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DateRangePicker;
