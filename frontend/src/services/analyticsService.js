import api from "./api";

export const getOverviewAnalytics = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};

export const getAdminEventsReport = async () => {
  const { data } = await api.get("/analytics/events");
  return data;
};
