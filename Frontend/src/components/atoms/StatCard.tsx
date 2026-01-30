import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  link?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  link = '#',
  isActive = false,
  onClick
}) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-xl shadow-sm border transition-shadow cursor-pointer ${
        isActive ? 'border-indigo-500 shadow-md' : 'border-gray-100 hover:shadow-md'
      } bg-white`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-lg bg-opacity-20 bg-indigo-100">
          {icon}
        </div>
      </div>
      
    </motion.div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

export default StatCard;
