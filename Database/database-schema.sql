--
-- PostgreSQL database dump
--


-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-06-18 14:00:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 859 (class 1247 OID 57350)
-- Name: bits_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.bits_enum AS ENUM (
    '0',
    '1'
);



--
-- TOC entry 877 (class 1247 OID 81921)
-- Name: bookingstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.bookingstatus_enum AS ENUM (
    'Pending',
    'Confirmed',
    'Rejected',
    'Active',
    'Completed',
    'Cancelled'
);



--
-- TOC entry 862 (class 1247 OID 57372)
-- Name: carcategory_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.carcategory_enum AS ENUM (
    'Sedan',
    'SUV',
    'Van',
    'Hatchback',
    'Luxury',
    'Sports'
);


--
-- TOC entry 868 (class 1247 OID 57394)
-- Name: carfuel_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.carfuel_enum AS ENUM (
    'Petrol',
    'Diesel',
    'Electric',
    'Hybrid',
    'CNG'
);



--
-- TOC entry 865 (class 1247 OID 57386)
-- Name: cartransmission_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.cartransmission_enum AS ENUM (
    'Automatic',
    'Manual',
    'Semi-Automatic'
);



--
-- TOC entry 856 (class 1247 OID 57345)
-- Name: user_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_enum AS ENUM (
    'user',
    'admin'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 81954)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    c_id integer NOT NULL,
    u_id integer NOT NULL,
    pickup_date date NOT NULL,
    return_date date NOT NULL,
    total_days integer NOT NULL,
    total_price integer NOT NULL,
    booking_status public.bookingstatus_enum DEFAULT 'Pending'::public.bookingstatus_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    is_deleted public.bits_enum DEFAULT '0'::public.bits_enum NOT NULL
);



--
-- TOC entry 223 (class 1259 OID 81953)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 223
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 222 (class 1259 OID 65537)
-- Name: car_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car_images (
    id integer NOT NULL,
    car_id integer NOT NULL,
    image_url character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    is_deleted public.bits_enum DEFAULT '0'::public.bits_enum NOT NULL
);



--
-- TOC entry 221 (class 1259 OID 65536)
-- Name: car_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.car_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 221
-- Name: car_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.car_images_id_seq OWNED BY public.car_images.id;


--
-- TOC entry 220 (class 1259 OID 57422)
-- Name: cars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cars (
    id integer NOT NULL,
    u_id integer NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    year integer NOT NULL,
    daily_price integer NOT NULL,
    category public.carcategory_enum NOT NULL,
    transmission public.cartransmission_enum NOT NULL,
    fuel_type public.carfuel_enum NOT NULL,
    seating_capacity integer NOT NULL,
    description text NOT NULL,
    address character varying(255) NOT NULL,
    pincode integer NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    area character varying(100) NOT NULL,
    availability_status public.bits_enum DEFAULT '0'::public.bits_enum NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    is_deleted public.bits_enum DEFAULT '0'::public.bits_enum NOT NULL,
    car_number character varying(20) NOT NULL
);



--
-- TOC entry 219 (class 1259 OID 57421)
-- Name: cars_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cars_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 219
-- Name: cars_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cars_id_seq OWNED BY public.cars.id;


--
-- TOC entry 218 (class 1259 OID 40963)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role public.user_enum DEFAULT 'user'::public.user_enum NOT NULL,
    phone_no character varying(15),
    profile_image character varying(255),
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp without time zone,
    "deletedAt" timestamp without time zone,
    isdeleted public.bits_enum DEFAULT '0'::public.bits_enum NOT NULL
);



--
-- TOC entry 217 (class 1259 OID 40962)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4738 (class 2604 OID 81957)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 65540)
-- Name: car_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_images ALTER COLUMN id SET DEFAULT nextval('public.car_images_id_seq'::regclass);


--
-- TOC entry 4732 (class 2604 OID 57425)
-- Name: cars id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars ALTER COLUMN id SET DEFAULT nextval('public.cars_id_seq'::regclass);


--
-- TOC entry 4728 (class 2604 OID 40966)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4751 (class 2606 OID 81962)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 65544)
-- Name: car_images car_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_images
    ADD CONSTRAINT car_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4747 (class 2606 OID 57431)
-- Name: cars cars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_pkey PRIMARY KEY (id);


--
-- TOC entry 4744 (class 2606 OID 40973)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4745 (class 1259 OID 65550)
-- Name: cars_car_number_active_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cars_car_number_active_unique ON public.cars USING btree (car_number) WHERE (is_deleted = '0'::public.bits_enum);


--
-- TOC entry 4742 (class 1259 OID 57370)
-- Name: users_email_active_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_active_unique ON public.users USING btree (email) WHERE (isdeleted = '0'::public.bits_enum);


--
-- TOC entry 4753 (class 2606 OID 65545)
-- Name: car_images car_images_car_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car_images
    ADD CONSTRAINT car_images_car_fk FOREIGN KEY (car_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- TOC entry 4752 (class 2606 OID 57432)
-- Name: cars cars_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cars
    ADD CONSTRAINT cars_user_fk FOREIGN KEY (u_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4754 (class 2606 OID 81963)
-- Name: bookings fk_booking_car; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_car FOREIGN KEY (c_id) REFERENCES public.cars(id) ON DELETE CASCADE;


--
-- TOC entry 4755 (class 2606 OID 81968)
-- Name: bookings fk_booking_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (u_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-06-18 14:00:51

--
-- PostgreSQL database dump complete
--

