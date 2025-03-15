-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2025 at 05:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ims_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ims_brand`
--

CREATE TABLE `ims_brand` (
  `id` int(11) NOT NULL,
  `categoryid` int(11) NOT NULL,
  `bname` varchar(250) NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_brand`
--

INSERT INTO `ims_brand` (`id`, `categoryid`, `bname`, `status`) VALUES
(1, 1, 'Giant', 'active'),
(2, 2, 'Trek', 'active'),
(3, 3, 'Shimano', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `ims_category`
--

CREATE TABLE `ims_category` (
  `categoryid` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_category`
--

INSERT INTO `ims_category` (`categoryid`, `name`, `status`) VALUES
(1, 'Bicycles', 'active'),
(2, 'Accessories', 'active'),
(3, 'Maintenance & Tools', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `ims_customer`
--

CREATE TABLE `ims_customer` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `address` text NOT NULL,
  `mobile` int(50) NOT NULL,
  `balance` double(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_customer`
--

INSERT INTO `ims_customer` (`id`, `name`, `address`, `mobile`, `balance`) VALUES
(1, 'Mark Cooper', 'Sample Address', 2147483647, 25000.00),
(2, 'George Wilson', '2306 St, Here There', 2147483647, 35000.00);

-- --------------------------------------------------------

--
-- Table structure for table `ims_order`
--

CREATE TABLE `ims_order` (
  `order_id` int(11) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `total_shipped` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_order`
--

INSERT INTO `ims_order` (`order_id`, `product_id`, `total_shipped`, `customer_id`, `order_date`) VALUES
(1, '1', 5, 1, '2022-06-20 08:20:40'),
(2, '2', 3, 2, '2022-06-20 08:20:48');

-- --------------------------------------------------------

--
-- Table structure for table `ims_product`
--

CREATE TABLE `ims_product` (
  `pid` int(11) NOT NULL,
  `categoryid` int(11) NOT NULL,
  `brandid` int(11) NOT NULL,
  `pname` varchar(300) NOT NULL,
  `model` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(150) NOT NULL,
  `base_price` double(10,2) NOT NULL,
  `tax` decimal(4,2) NOT NULL,
  `minimum_order` double(10,2) NOT NULL,
  `supplier` int(11) NOT NULL,
  `status` enum('active','inactive') NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_product`
--

INSERT INTO `ims_product` (`pid`, `categoryid`, `brandid`, `pname`, `model`, `description`, `quantity`, `unit`, `base_price`, `tax`, `minimum_order`, `supplier`, `status`, `date`) VALUES
(17, 1, 1, 'Road Bike', 'POR-324', 'Broom Broom', 11, 'Nos', 3000.00, 20.00, 0.00, 1, 'active', '0000-00-00'),
(18, 1, 2, 'BMX Frame', 'BMX Trex', 'Trex', 16, 'Nos', 8500.00, 10.00, 0.00, 2, 'active', '0000-00-00'),
(19, 1, 2, 'City Ride', 'City Ride', 'City Ride', 9, 'Nos', 15000.00, 10.00, 0.00, 2, 'active', '0000-00-00'),
(20, 1, 1, 'Tour Cycle', 'Tour Cycle', 'Tour Cycle', 6, 'Nos', 30000.00, 10.00, 0.00, 3, 'active', '0000-00-00'),
(21, 1, 3, 'MTB Frame', 'MTB Frame', 'MTB Frame', 12, 'Nos', 12000.00, 10.00, 0.00, 2, 'active', '0000-00-00'),
(22, 2, 2, 'Bell Horn', 'Bell Horn', 'Bell Horn', 23, 'Nos', 150.00, 10.00, 0.00, 3, 'active', '0000-00-00'),
(23, 2, 1, 'Bike Lock', 'Bike Lock', 'Bike Lock', 28, 'Nos', 800.00, 10.00, 0.00, 3, 'active', '0000-00-00'),
(24, 2, 3, 'Rear Rack', 'Rear Rack', 'Rear Rack', 22, 'Nos', 1500.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(25, 2, 1, 'Grip Tape', 'Grip Tape', 'Grip Tape', 32, 'Nos', 600.00, 10.00, 0.00, 2, 'active', '0000-00-00'),
(26, 2, 1, 'Water Cage', 'Water Cage', 'Water Cage', 27, 'Nos', 450.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(27, 3, 2, 'Chain Lube', 'Chain Lube', 'Chain Lube', 29, 'Nos', 250.00, 10.00, 0.00, 2, 'active', '0000-00-00'),
(28, 3, 3, 'Tire Pump', 'Tire Pump', 'Tire Pump', 33, 'Nos', 1200.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(29, 3, 2, 'Hex Wrench', 'Hex Wrench', 'Hex Wrench', 40, 'Nos', 500.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(30, 3, 2, 'Rim Strip', 'Rim Strip', 'Rim Strip', 40, 'Nos', 300.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(31, 3, 2, 'Brake Pads', 'Brake Pads', 'Brake Pads', 22, 'Nos', 700.00, 10.00, 0.00, 1, 'active', '0000-00-00'),
(32, 3, 2, 'Gear Grease', 'Gear Grease', 'Gear Grease', 20, 'Nos', 350.00, 10.00, 0.00, 3, 'active', '0000-00-00'),
(33, 2, 1, 'brake', 'pos123', 'asdadsasdads', 97, 'Meters', 100.00, 88.00, 0.00, 1, 'active', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `ims_purchase`
--

CREATE TABLE `ims_purchase` (
  `purchase_id` int(11) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `purchase_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_purchase`
--

INSERT INTO `ims_purchase` (`purchase_id`, `supplier_id`, `product_id`, `quantity`, `purchase_date`) VALUES
(1, '1', '1', '25', '2022-06-20 08:20:07'),
(2, '2', '2', '35', '2022-06-20 08:20:14'),
(3, '3', '3', '10', '2022-06-20 08:20:29');

-- --------------------------------------------------------

--
-- Table structure for table `ims_supplier`
--

CREATE TABLE `ims_supplier` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(200) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_supplier`
--

INSERT INTO `ims_supplier` (`supplier_id`, `supplier_name`, `mobile`, `address`, `status`) VALUES
(1, 'BikeWorld Trading', '09645987123', 'Over Here', 'active'),
(2, 'Cycling Hub Supplies', '094568791252', 'Over There', 'active'),
(3, 'RideGear Distributors', '09789897879', 'Anywhere There', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `ims_user`
--

CREATE TABLE `ims_user` (
  `userid` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` enum('admin','member') NOT NULL,
  `status` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ims_user`
--

INSERT INTO `ims_user` (`userid`, `email`, `password`, `name`, `type`, `status`) VALUES
(1, 'admin@mail.com', '0192023a7bbd73250516f069df18b500', 'Administrator', 'admin', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ims_brand`
--
ALTER TABLE `ims_brand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ims_category`
--
ALTER TABLE `ims_category`
  ADD PRIMARY KEY (`categoryid`);

--
-- Indexes for table `ims_customer`
--
ALTER TABLE `ims_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ims_order`
--
ALTER TABLE `ims_order`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `ims_product`
--
ALTER TABLE `ims_product`
  ADD PRIMARY KEY (`pid`);

--
-- Indexes for table `ims_purchase`
--
ALTER TABLE `ims_purchase`
  ADD PRIMARY KEY (`purchase_id`);

--
-- Indexes for table `ims_supplier`
--
ALTER TABLE `ims_supplier`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `ims_user`
--
ALTER TABLE `ims_user`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ims_brand`
--
ALTER TABLE `ims_brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ims_category`
--
ALTER TABLE `ims_category`
  MODIFY `categoryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ims_customer`
--
ALTER TABLE `ims_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ims_order`
--
ALTER TABLE `ims_order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ims_product`
--
ALTER TABLE `ims_product`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `ims_purchase`
--
ALTER TABLE `ims_purchase`
  MODIFY `purchase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ims_supplier`
--
ALTER TABLE `ims_supplier`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ims_user`
--
ALTER TABLE `ims_user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
