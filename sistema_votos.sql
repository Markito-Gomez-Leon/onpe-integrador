-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-06-2026 a las 23:17:49
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
-- Estructura de tabla para la tabla `candidatos`
--

CREATE TABLE `candidatos` (
  `id` int(11) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `partido` varchar(100) NOT NULL,
  `votos` int(11) DEFAULT 0,
  `foto_candidato` varchar(255) DEFAULT 'default_candidato.png',
  `logo_partido` varchar(255) DEFAULT 'default_logo.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `candidatos`
--

INSERT INTO `candidatos` (`id`, `categoria`, `nombre`, `partido`, `votos`, `foto_candidato`, `logo_partido`) VALUES
(1, 'presidencial', ' KEIKO FUJIMORI FP', 'Fuerza Popular (FP)', 2857691, 'fp_cand.png', 'fp_logo.png'),
(2, 'presidencial', 'ROBERTO SANCHEZ JP', 'Juntos por el Perú (JP)', 1998595, 'jp_cand.png', 'jp_logo.png'),
(3, 'presidencial', 'RAPHAEL LOPEZ RP', 'Renovación Popular (RP)', 1982868, 'rp_cand.png', 'rp_logo.png'),
(4, 'presidencial', 'LOPEZ CHAO AN', 'Ahora Nación (AN)', 1320400, 'an_cand.png', 'an_logo.png'),
(5, 'presidencial', 'CESAR ACUÑA APP', 'Alianza Para el Progreso (APP)', 1120500, 'app_cand.png', 'app_logo.png'),
(6, 'presidencial', 'JOSE WILLIAMS AP', 'Avanza País (AP)', 980350, 'ap_cand.png', 'ap_logo.png'),
(7, 'senado', 'Francisco Calisto Giampietri', 'Renovación Popular (RP)', 850401, 'default_candidato.png', 'default_logo.png'),
(8, 'senado', 'Marco Miyashiro Arashiro', 'Fuerza Popular (FP)', 810200, 'default_candidato.png', 'default_logo.png'),
(9, 'senado', 'Daniel Barragán Coloma', 'Unión por el Perú (UPP)', 750000, 'default_candidato.png', 'default_logo.png'),
(10, 'senado', 'Marisol Pérez Tello', 'Partido Popular Cristiano (PPC)', 720150, 'default_candidato.png', 'default_logo.png'),
(11, 'senado', 'Juan José Santibáñez Antúnez', 'Avanza País (AP)', 680000, 'default_candidato.png', 'default_logo.png'),
(12, 'senado', 'Carla García Buscaglia', 'Partido Aprista Peruano (APRA)', 650000, 'default_candidato.png', 'default_logo.png'),
(13, 'senado', 'Jorge del Castillo Gálvez', 'Partido Aprista Peruano (APRA)', 610000, 'default_candidato.png', 'default_logo.png'),
(14, 'senado', 'Norma Yarrow Lumbreras', 'Renovación Popular (RP)', 590000, 'default_candidato.png', 'default_logo.png'),
(15, 'senado', 'Javier Bedoya Denegri', 'Partido Popular Cristiano (PPC)', 540000, 'default_candidato.png', 'default_logo.png'),
(16, 'senado', 'Duberlí Rodríguez Tineo', 'Juntos por el Perú (JP)', 490000, 'default_candidato.png', 'default_logo.png'),
(17, 'diputados', 'Harvey Colchado Huamaní', 'Partido Morado (PM)', 920001, 'default_candidato.png', 'default_logo.png'),
(18, 'diputados', 'Adriana Tudela Gutiérrez', 'Avanza País (AP)', 890500, 'default_candidato.png', 'default_logo.png'),
(19, 'diputados', 'Diego Pomareda Muñoz', 'Acción Popular (AP)', 810000, 'default_candidato.png', 'default_logo.png'),
(20, 'diputados', 'Mauricio Mulder Bedoya', 'Partido Aprista Peruano (APRA)', 780000, 'default_candidato.png', 'default_logo.png'),
(21, 'diputados', 'Alejandro Cavero Alva', 'Avanza País (AP)', 750200, 'default_candidato.png', 'default_logo.png'),
(22, 'diputados', 'Sigrid Bazán Narváez', 'Juntos por el Perú (JP)', 720000, 'default_candidato.png', 'default_logo.png'),
(23, 'diputados', 'Ruth Luque Ibarra', 'Juntos por el Perú (JP)', 690000, 'default_candidato.png', 'default_logo.png'),
(24, 'diputados', 'Arturo Alegría García', 'Fuerza Popular (FP)', 650000, 'default_candidato.png', 'default_logo.png'),
(25, 'diputados', 'Eduardo Salhuana Cavides', 'Alianza Para el Progreso (APP)', 610000, 'default_candidato.png', 'default_logo.png'),
(26, 'diputados', 'Patricia Juárez Gallegos', 'Fuerza Popular (FP)', 580000, 'default_candidato.png', 'default_logo.png'),
(27, 'andino', 'Gustavo Pacheco Villar', 'Renovación Popular (RP)', 450000, 'default_candidato.png', 'default_logo.png'),
(28, 'andino', 'Juan Carlos Ramírez Gastón', 'Avanza País (AP)', 420000, 'default_candidato.png', 'default_logo.png'),
(29, 'andino', 'Fernando Arce Alvarado', 'Perú Libre (PL)', 390000, 'default_candidato.png', 'default_logo.png'),
(30, 'andino', 'Enrique Valderrama Jaramillo', 'Partido Aprista Peruano (APRA)', 360001, 'default_candidato.png', 'default_logo.png'),
(31, 'andino', 'Maali Olga Del Pomar Saettone', 'Fuerza Popular (FP)', 340000, 'default_candidato.png', 'default_logo.png'),
(32, 'andino', 'Betty Valdivieso Méndez', 'Alianza Para el Progreso (APP)', 310000, 'default_candidato.png', 'default_logo.png'),
(33, 'andino', 'Leslye Lazo Villón', 'Acción Popular (AP)', 290000, 'default_candidato.png', 'default_logo.png'),
(34, 'andino', 'Luis Galarreta Velarde', 'Fuerza Popular (FP)', 270000, 'default_candidato.png', 'default_logo.png'),
(35, 'andino', 'Alan Fairlie Reinoso', 'Juntos por el Perú (JP)', 250000, 'default_candidato.png', 'default_logo.png'),
(36, 'andino', 'Jorge Ramírez Reyna', 'Partido Morado (PM)', 210000, 'default_candidato.png', 'default_logo.png'),
(37, 'presidencial', 'Voto en Blanco', 'Opciones Neutrales', 1, 'default_candidato.png', 'default_logo.png'),
(38, 'senado', 'Voto en Blanco', 'Opciones Neutrales', 1, 'default_candidato.png', 'default_logo.png'),
(39, 'diputados', 'Voto en Blanco', 'Opciones Neutrales', 1, 'default_candidato.png', 'default_logo.png'),
(40, 'andino', 'Voto en Blanco', 'Opciones Neutrales', 1, 'default_candidato.png', 'default_logo.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padron`
--

CREATE TABLE `padron` (
  `dni` varchar(8) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `fecha_emision` varchar(10) DEFAULT NULL,
  `digito_verificador` varchar(1) DEFAULT NULL,
  `estado` enum('PENDIENTE','YA_VOTO') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `padron`
--

INSERT INTO `padron` (`dni`, `nombre`, `apellido`, `fecha_emision`, `digito_verificador`, `estado`) VALUES
('11111111', 'marco', 'gomez', '11/11/1111', '1', 'PENDIENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `id` int(11) NOT NULL,
  `siglas` varchar(10) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `logo_partido` varchar(255) DEFAULT 'default_logo.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidos`
--

INSERT INTO `partidos` (`id`, `siglas`, `nombre`, `logo_partido`) VALUES
(1, 'FP', 'Fuerza Popular', 'default_logo.png'),
(2, 'JP', 'Juntos por el Perú', 'default_logo.png'),
(3, 'RP', 'Renovación Popular', 'default_logo.png'),
(4, 'AN', 'Ahora Nación', 'default_logo.png'),
(5, 'APP', 'Alianza Para el Progreso', 'default_logo.png'),
(6, 'AP', 'Avanza País', 'default_logo.png'),
(7, 'PP', 'Podemos Perú', 'default_logo.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `candidatos`
--
ALTER TABLE `candidatos`
  ADD PRIMARY KEY (`id`);

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

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `candidatos`
--
ALTER TABLE `candidatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `partidos`
--
ALTER TABLE `partidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
