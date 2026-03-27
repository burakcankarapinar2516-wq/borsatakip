import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, LineSeries, CandlestickData, LineData } from 'lightweight-charts';
import { useTheme } from '../App';

interface AdvancedChartProps {
  data: CandlestickData[];
  sma20Data: LineData[];
  sma50Data: LineData[];
  rsiData: LineData[];
  isPositive: boolean;
}

export const AdvancedChart: React.FC<AdvancedChartProps> = ({ 
  data, 
  sma20Data, 
  sma50Data, 
  rsiData,
  isPositive 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      chartRef.current?.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const isDark = theme === 'dark';
    const textColor = isDark ? '#8E9299' : '#4A4D54';
    const gridColor = isDark ? 'rgba(142, 146, 153, 0.1)' : 'rgba(74, 77, 84, 0.05)';

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      },
    });

    chartRef.current = chart;

    // Main Candlestick Series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00C805',
      downColor: '#FF3B30',
      borderVisible: false,
      wickUpColor: '#00C805',
      wickDownColor: '#FF3B30',
    });
    candlestickSeries.setData(data);

    // SMA 20
    const sma20Series = chart.addSeries(LineSeries, {
      color: '#2196F3',
      lineWidth: 2,
      title: 'SMA 20',
    });
    sma20Series.setData(sma20Data);

    // SMA 50
    const sma50Series = chart.addSeries(LineSeries, {
      color: '#FF9800',
      lineWidth: 2,
      title: 'SMA 50',
    });
    sma50Series.setData(sma50Data);

    // RSI (Separate Pane)
    const rsiSeries = chart.addSeries(LineSeries, {
      color: '#9C27B0',
      lineWidth: 2,
      priceScaleId: 'rsi',
      title: 'RSI',
    });
    
    chart.priceScale('rsi').applyOptions({
      scaleMargins: {
        top: 0.75,
        bottom: 0.05,
      },
    });
    
    rsiSeries.setData(rsiData);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, sma20Data, sma50Data, rsiData, theme]);

  return (
    <div className="relative w-full">
      <div ref={chartContainerRef} className="w-full" />
      <div className="absolute top-4 left-4 flex gap-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#2196F3]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SMA 20</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF9800]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SMA 50</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#9C27B0]" />
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">RSI</span>
        </div>
      </div>
    </div>
  );
};
