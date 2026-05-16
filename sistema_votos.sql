-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2026 a las 02:48:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_votos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padron`
--

CREATE TABLE `padron` (
  `dni` varchar(8) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `padron`
--

INSERT INTO `padron` (`dni`, `nombre`, `estado`) VALUES
('12345678', 'JUAN PEREZ', 'YA_VOTO'),
('40112233', 'LUIS RAMIREZ FLORES', 'PENDIENTE'),
('41223344', 'CARMEN CASTRO RUIZ', 'PENDIENTE'),
('42556677', 'MIGUEL TORRES VARGAS', 'PENDIENTE'),
('43667788', 'ELENA ROJAS SILVA', 'PENDIENTE'),
('46990011', 'CARLOS VEGA RIVERA', 'PENDIENTE'),
('47001122', 'LUCIA MENDOZA SALAS', 'PENDIENTE'),
('70334455', 'JORGE QUISPE MAMANI', 'PENDIENTE'),
('71445566', 'ROSA ALVAREZ DIAZ', 'PENDIENTE'),
('74778899', 'DIEGO NAVARRO CRUZ', 'PENDIENTE'),
('75889900', 'VALERIA PAREDES LARA', 'PENDIENTE'),
('87654321', 'MARIA GOMEZ', 'PENDIENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `votos` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidos`
--

INSERT INTO `partidos` (`id`, `nombre`, `votos`) VALUES
(1, 'Partido Integridad', 0),
(2, 'Fuerza Innovadora', 1),
(3, 'Alianza Digital', 2),
(4, 'Unión Verde', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `padron`
--
ALTER TABLE `padron`
  ADD PRIMARY KEY (`dni`);

--
-- Indices de la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
