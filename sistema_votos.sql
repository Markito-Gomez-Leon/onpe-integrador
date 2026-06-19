-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2026 a las 22:10:40
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
  `dni` char(8) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `fecha_emision` varchar(10) NOT NULL,
  `digito_verificador` char(1) NOT NULL,
  `estado` varchar(20) DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `padron`
--

INSERT INTO `padron` (`dni`, `nombre`, `apellido`, `fecha_emision`, `digito_verificador`, `estado`) VALUES
('10101010', 'Nombre10', 'Apellido10', '01/01/2001', '1', 'PENDIENTE'),
('11111111', 'Marco', 'Gomez', '01/01/2001', '1', 'YA_VOTO'),
('20202020', 'Nombre11', 'Apellido11', '01/01/2001', '1', 'PENDIENTE'),
('22222222', 'Ariana', 'Torres', '01/01/2001', '1', 'PENDIENTE'),
('30303030', 'Nombre12', 'Apellido12', '01/01/2001', '1', 'PENDIENTE'),
('33333333', 'Christian', 'Ramos', '01/01/2001', '1', 'PENDIENTE'),
('44444444', 'Luis', 'Vargas', '01/01/2001', '1', 'PENDIENTE'),
('55555555', 'Maria', 'Rojas', '01/01/2001', '1', 'YA_VOTO'),
('66666666', 'Jorge', 'Perez', '01/01/2001', '1', 'PENDIENTE'),
('77777777', 'Ana', 'Lopez', '01/01/2001', '1', 'PENDIENTE'),
('88888888', 'Carlos', 'Mejia', '01/01/2001', '1', 'PENDIENTE'),
('99999999', 'Elena', 'Castro', '01/01/2001', '1', 'PENDIENTE');

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
(1, 'Partido Integridad', 1),
(2, 'Fuerza Innovadora', 2),
(3, 'Alianza Digital', 2),
(4, 'Unión Verde', 1),
(5, 'Voto en Blanco', 0);

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
