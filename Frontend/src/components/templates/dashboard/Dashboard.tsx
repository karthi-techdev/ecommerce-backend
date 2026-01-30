import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import type { ApexOptions } from 'apexcharts';
import type { JSX } from 'react';

interface StatCard {
  title: string;
  value: string;
  icon: JSX.Element;
  change: string;
  trend: 'up' | 'down'; 
  link: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  link: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  participants: number | null;
  link: string;
}

const Dashboard = () => {
  // Chart data with proper typing
  const employeeStatusData = {
    options: {
      chart: {
        type: 'donut' as const,
      },
      labels: ['Active', 'On Leave', 'Probation', 'Terminated'],
      colors: ['#4f46e5', '#f59e0b', '#10b981', '#ef4444'],
      legend: {
        position: 'bottom' as const,
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom' as const
          }
        }
      }]
    } as ApexOptions,
    series: [65, 15, 10, 10]
  };

  const attendanceTrendData = {
    options: {
      chart: {
        type: 'line' as const,
        toolbar: {
          show: false
        }
      },
      colors: ['#4f46e5', '#10b981'],
      stroke: {
        curve: 'smooth' as const,
        width: 3
      },
      markers: {
        size: 5
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        min: 0,
        max: 100
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        position: 'top' as const,
      }
    } as ApexOptions,
    series: [
      {
        name: 'Attendance %',
        data: [85, 82, 90, 87, 88, 92, 89, 91, 88, 90, 93, 95]
      },
      {
        name: 'Punctuality %',
        data: [78, 80, 82, 85, 83, 88, 86, 89, 87, 90, 92, 94]
      }
    ]
  };

  const departmentDistributionData = {
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: {
          show: false
        }
      },
      colors: ['#4f46e5'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Customer Support'],
      }
    } as ApexOptions,
    series: [
      {
        name: 'Employees',
        data: [45, 12, 18, 24, 30, 28, 15]
      }
    ]
  };

  // Stats cards data
  const stats: StatCard[] = [
    { 
      title: 'Total Employees', 
      value: '324', 
      icon: <FiUsers className="text-indigo-600" />, 
      change: '+12%', 
      trend: 'up',
      link: '/employees'
    },
    { 
      title: 'On Leave Today', 
      value: '24', 
      icon: <FiCalendar className="text-amber-500" />, 
      change: '+3%', 
      trend: 'up',
      link: '/attendance'
    },
    { 
      title: 'Open Positions', 
      value: '15', 
      icon: <FiBriefcase className="text-emerald-500" />, 
      change: '-5%', 
      trend: 'down',
      link: '/recruitment'
    },
    { 
      title: 'Payroll Due', 
      value: '$48,500', 
      icon: <FiDollarSign className="text-rose-500" />, 
      change: '+18%', 
      trend: 'up',
      link: '/payroll'
    }
  ];

  // Recent activities data
  const activities: Activity[] = [
    { id: 1, user: 'John Smith', action: 'submitted leave request', time: '2 mins ago', link: '/leave-requests' },
    { id: 2, user: 'Sarah Johnson', action: 'updated personal information', time: '15 mins ago', link: '/employees/123' },
    { id: 3, user: 'IT Department', action: 'added new software access for 5 employees', time: '1 hour ago', link: '/system-access' },
    { id: 4, user: 'Payroll System', action: 'processed monthly salaries', time: '3 hours ago', link: '/payroll' },
    { id: 5, user: 'Michael Brown', action: 'completed onboarding process', time: '1 day ago', link: '/onboarding' }
  ];

  // Upcoming events data
  const events: Event[] = [
    { id: 1, title: 'Quarterly Review Meeting', date: 'Tomorrow, 10:00 AM', participants: 12, link: '/events/1' },
    { id: 2, title: 'HR Policy Update Training', date: 'Jun 15, 2:00 PM', participants: 45, link: '/training/2' },
    { id: 3, title: 'Team Building Activity', date: 'Jun 20, 9:00 AM', participants: 80, link: '/events/3' },
    { id: 4, title: 'Performance Appraisal Deadline', date: 'Jun 30', participants: null, link: '/performance' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <Link 
            to={stat.link} 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 rounded-lg bg-opacity-20 bg-indigo-100">
                {stat.icon}
              </div>
            </div>
            <div className={`mt-4 text-sm flex items-center ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              <span className="text-gray-400 ml-1">vs last month</span>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Employee Status</h2>
            <Link to="/employee" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </Link>
          </div>
          <Chart 
            options={employeeStatusData.options} 
            series={employeeStatusData.series} 
            type="donut" 
            height={300} 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Attendance Trend</h2>
            <Link to="/attendance" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View Details →
            </Link>
          </div>
          <Chart 
            options={attendanceTrendData.options} 
            series={attendanceTrendData.series} 
            type="line" 
            height={300} 
          />
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Department Distribution</h2>
            <Link to="/departments" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </Link>
          </div>
          <Chart 
            options={departmentDistributionData.options} 
            series={departmentDistributionData.series} 
            type="bar" 
            height={300} 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <Link to="/activities" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <Link 
                to={activity.link} 
                key={activity.id} 
                className="flex items-start hover:bg-gray-50 p-2 rounded transition"
              >
                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-600 mr-3"></div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <Link 
                to={event.link} 
                key={event.id} 
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.date}</p>
                  </div>
                  {event.participants !== null && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {event.participants} attending
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/employees/add" 
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center"
            >
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                <FiUsers className="text-lg" />
              </div>
              <span className="text-sm font-medium">Add Employee</span>
            </Link>
            <Link 
              to="/leave/approve" 
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center"
            >
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-2">
                <FiCalendar className="text-lg" />
              </div>
              <span className="text-sm font-medium">Approve Leave</span>
            </Link>
            <Link 
              to="/jobs/post" 
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center"
            >
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <FiBriefcase className="text-lg" />
              </div>
              <span className="text-sm font-medium">Post Job</span>
            </Link>
            <Link 
              to="/payroll/run" 
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center"
            >
              <div className="h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
                <FiDollarSign className="text-lg" />
              </div>
              <span className="text-sm font-medium">Run Payroll</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;