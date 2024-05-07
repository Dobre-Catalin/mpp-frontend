import { BarChart } from "@mui/x-charts/BarChart";
import { CarContext } from "../../Context/CarListContext";
import { useContext, useEffect, useState } from "react";

export default function ChartPrices() {
    const { cars, fetchCars } = useContext(CarContext);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    useEffect(() => {
        if (cars.length > 0) {
            const maxPrices = {};

            cars.forEach((car) => {
                const brand = car.make;
                const price = car.price;
                if (!maxPrices[brand] || price > maxPrices[brand]) {
                    maxPrices[brand] = price;
                }
            });

            const newChartData = Object.keys(maxPrices).map((brand) => ({
                x: brand,
                y: maxPrices[brand]
            }));

            setChartData(newChartData);
        }
    }, [cars]);

    return (
        <>
            {chartData.length > 0 && (
                <BarChart
                    dataset={chartData}
                    xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
                    series={[{ scaleType: 'linear', dataKey: 'y' }]}
                    width={1000}
                    height={500}
                />
            )}
        </>
    );
}
