import {
  Ban,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ListChecks,
  PieChart,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { IDashboard } from "../../Data/AppInterface";
import { BookingStatus } from "../../Data/AppEnum";
import axiosInstance from "../../component/axiosInstance";

import ToastMessage from "../../component/Toast/ToastMessage";
import { MessageType } from "../../Data/AppEnum";
import { currency } from "../../config/AppConfig";

type StatusMeta = {
  label: BookingStatus;
  value: number;
  bar: string;
  dot: string;
  pill: string;
  border: string;
  icon: LucideIcon;
  iconClass: string;
};

type DashboardStat =
  | {
      kind: "icon";
      label: string;
      value: number;
      icon: LucideIcon;
      iconClass: string;
    }
  | {
      kind: "status";
      label: BookingStatus;
      value: number;
      status: StatusMeta;
    };

const numberFormat = new Intl.NumberFormat("en-IN");

const Dashboard = () => {
  const [data, setdata] = useState<IDashboard | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/owner/dashboard");
        setdata(res.data.data);
      } catch (e: any) {
        ToastMessage(MessageType.Error,"Server Error try again later");
      }
    };
    fetch();
  }, []);

  const statusMeta: StatusMeta[] = useMemo(
    () => [
      {
        label: BookingStatus.Pending,
        value: data?.pendingCount ?? 0,
        bar: "bg-amber-400",
        dot: "bg-amber-400",
        pill: "bg-amber-100 text-amber-800",
        border: "border-amber-500/40",
        icon: Clock3,
        iconClass: "text-amber-600",
      },
      {
        label: BookingStatus.Confirmed,
        value: data?.confirmedCount ?? 0,
        bar: "bg-sky-500",
        dot: "bg-sky-500",
        pill: "bg-sky-100 text-sky-800",
        border: "border-sky-500/40",
        icon: CheckCircle2,
        iconClass: "text-sky-600",
      },
      {
        label: BookingStatus.Active,
        value: data?.activeCount ?? 0,
        bar: "bg-lime-600",
        dot: "bg-lime-600",
        pill: "bg-lime-100 text-lime-800",
        border: "border-lime-500/40",
        icon: Car,
        iconClass: "text-lime-600",
      },
      {
        label: BookingStatus.Completed,
        value: data?.completedCount ?? 0,
        bar: "bg-indigo-500",
        dot: "bg-indigo-500",
        pill: "bg-indigo-100 text-indigo-800",
        border: "border-indigo-500/40",
        icon: Check,
        iconClass: "text-indigo-600",
      },
      {
        label: BookingStatus.Rejected,
        value: data?.rejectedCount ?? 0,
        bar: "bg-red-500",
        dot: "bg-red-500",
        pill: "bg-red-100 text-red-800",
        border: "border-red-500/40",
        icon: X,
        iconClass: "text-red-600",
      },
      {
        label: BookingStatus.Cancelled,
        value: data?.cancelledCount ?? 0,
        bar: "bg-stone-400",
        dot: "bg-stone-400",
        pill: "bg-stone-100 text-stone-700",
        border: "border-stone-500/40",
        icon: Ban,
        iconClass: "text-stone-500",
      },
    ],
    [data],
  );

  const statusByLabel = useMemo(
    () =>
      statusMeta.reduce(
        (acc, status) => {
          acc[status.label] = status;
          return acc;
        },
        {} as Record<BookingStatus, StatusMeta>,
      ),
    [statusMeta],
  );

  const totalStatusBookings = statusMeta.reduce(
    (total, status) => total + status.value,
    0,
  );

  const stats: DashboardStat[] = [
    {
      kind: "icon",
      label: "Total cars",
      value: data?.totalCars ?? 0,
      icon: Car,
      iconClass: "bg-sky-100 text-sky-700",
    },
    {
      kind: "icon",
      label: "Total bookings",
      value: data?.totalBookings ?? 0,
      icon: ListChecks,
      iconClass: "bg-indigo-100 text-indigo-700",
    },
    ...statusMeta.map((status) => ({
      kind: "status" as const,
      label: status.label,
      value: status.value,
      status,
    })),
  ];

  const monthlyRevenue = data?.monthlyRevenue ?? 0;
  const recentBookings = data?.recentBookings ?? [];

  return (
    <section className="min-h-screen rounded-2xl bg-[#f4f6fb] px-3 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl min-w-0 flex-col gap-6 sm:gap-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base md:text-lg">
            Fleet performance, bookings, and revenue at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,410px)_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
              Monthly revenue
            </p>
            <div className="mt-4 flex min-w-0 items-center text-4xl font-light text-slate-950 sm:text-5xl lg:text-6xl">
              <IndianRupee className="mr-1 size-8 shrink-0 sm:size-10 lg:size-12" />
              {numberFormat.format(monthlyRevenue)}
            </div>
            <div className="my-5 h-px bg-slate-200 sm:my-7" />
            <p className="max-w-xs text-base leading-snug text-slate-500 sm:text-lg">
              From active and completed bookings only
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-base font-medium text-slate-700 sm:text-lg">
              Booking breakdown - all statuses
            </h2>

            <div className="mt-5 flex h-5 overflow-hidden rounded-md bg-slate-100 sm:mt-6 sm:h-6">
              {statusMeta.map((status) => (
                <div
                  key={status.label}
                  className={`${status.bar} min-w-2`}
                  style={{
                    width:
                      totalStatusBookings > 0
                        ? `${(status.value / totalStatusBookings) * 100}%`
                        : `${100 / statusMeta.length}%`,
                  }}
                  title={`${status.label}: ${status.value}`}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 sm:gap-x-7 sm:gap-y-4">
              {statusMeta.map((status) => (
                <div
                  key={status.label}
                  className="flex items-center gap-2 text-sm text-slate-600 sm:text-lg"
                >
                  <span className={`size-3 rounded-full ${status.dot}`} />
                  <span>{status.label}</span>
                  <span className="font-semibold text-slate-950">
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {stats.map((stat) => {
            return (
              <div
                key={stat.label}
                className="min-h-36 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:min-h-40 sm:p-6"
              >
                {stat.kind === "icon" ? (
                  <div
                    className={`mb-4 flex size-11 items-center justify-center rounded-lg sm:mb-5 sm:size-12 ${stat.iconClass}`}
                  >
                    <stat.icon className="size-5" /> 
                  </div>
                ) : (
                  <span
                    className={`mb-4 inline-flex min-w-24 justify-center rounded-full px-3 py-1 text-sm font-medium sm:min-w-28 sm:px-4 ${stat.status.pill}`}
                  >
                    {stat.label}
                  </span>
                )}
                <p className="text-3xl font-light text-slate-950 sm:text-4xl">
                  {numberFormat.format(stat.value)}
                </p>
                <p className="mt-3 text-base text-slate-500 sm:text-lg">
                  {stat.kind === "status" ? "bookings" : stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_410px]">
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                <CalendarDays className="size-5 text-slate-600" />
                Recent bookings
              </h2>
              <p className="text-base text-slate-500 sm:text-lg">
                Latest activity across your fleet
              </p>
            </div>
            <div className="my-5 h-px bg-slate-200 sm:my-7" />

            {recentBookings.length === 0 ? (
              <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-500">
                No recent bookings yet
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentBookings.map((booking) => {
                  const status =
                    statusByLabel[booking.booking_status] ??
                    statusByLabel[BookingStatus.Pending];

                  return (
                    <div
                      key={booking.id}
                      className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4"
                    >
                      <div className="contents sm:flex sm:min-w-0 sm:items-center sm:gap-4">
                        <img
                          src={booking.car_image}
                          alt={`${booking.car.brand} ${booking.car.model}`}
                          className="size-14 shrink-0 rounded-xl border border-slate-200 object-cover sm:size-16"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=150";
                          }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold text-slate-950 sm:text-xl">
                            {booking.car.brand} {booking.car.model}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 sm:text-base">
                            <CalendarDays className="size-4" />
                            {new Date(booking.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-2 flex min-w-0 flex-wrap items-center justify-between gap-3 sm:col-span-1 sm:justify-end sm:gap-4">
                        <p className="text-lg font-semibold text-slate-950 sm:text-xl">
                          {currency}
                          {numberFormat.format(booking.total_price)}
                        </p>
                        <span
                          className={`min-w-24 rounded-full px-3 py-1 text-center text-sm font-medium sm:min-w-28 sm:px-4 ${status.pill}`}
                        >
                          {booking.booking_status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                <PieChart className="size-5 text-slate-600" />
                Status summary
              </h2>
              <p className="text-base text-slate-500 sm:text-lg">All-time counts</p>
            </div>
            <div className="my-5 h-px bg-slate-200 sm:my-7" />

            <div className="divide-y divide-slate-200">
              {statusMeta.map((status) => {
                const StatusIcon = status.icon;

                return (
                  <div
                    key={status.label}
                    className="flex items-center justify-between gap-4 py-4 sm:gap-5"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <StatusIcon
                        className={`size-5 shrink-0 ${status.iconClass}`}
                      />
                    <span className="truncate text-base text-slate-600 sm:text-xl">
                      {status.label}
                    </span>
                  </div>
                  <span className="text-base font-semibold text-slate-950 sm:text-xl">
                    {numberFormat.format(status.value)}
                  </span>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
