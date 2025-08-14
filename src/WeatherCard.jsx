import { FaSun, FaCloud, FaCloudRain, FaSnowflake } from 'react-icons/fa';

export default function WeatherCard({ day, temp, description, main }) {
  const getIcon = () => {
    switch (main) {
      case 'Clear':
        return <FaSun size={30} />;
      case 'Clouds':
        return <FaCloud size={30} />;
      case 'Rain':
        return <FaCloudRain size={30} />;
      case 'Snow':
        return <FaSnowflake size={30} />;
      default:
        return <FaCloud size={30} />;
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-xl text-white text-center shadow">
      {getIcon()}
      <h3 className="mt-2 font-semibold">{day}</h3>
      <p className="text-lg">{temp}°</p>
      <p className="capitalize">{description}</p>
    </div>
  );
}
