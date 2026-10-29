export const ANNOUNCEMENTS_STORAGE_KEY = "delivery-active-announcements";
export const ANNOUNCEMENTS_UPDATED_EVENT = "announcements-updated";

export function getStoredAnnouncements() {
  const savedAnnouncements = window.localStorage.getItem(
    ANNOUNCEMENTS_STORAGE_KEY,
  );

  if (!savedAnnouncements) {
    return [];
  }

  const announcements = JSON.parse(savedAnnouncements);

  if (!Array.isArray(announcements)) {
    throw new Error("Saved announcements must be an array.");
  }

  return announcements;
}

export function saveAnnouncements(announcements) {
  window.localStorage.setItem(
    ANNOUNCEMENTS_STORAGE_KEY,
    JSON.stringify(announcements),
  );
  window.dispatchEvent(new Event(ANNOUNCEMENTS_UPDATED_EVENT));
}

export function getAnnouncementOrderTotals(announcement, guestOrders) {
  const announcementId = announcement?._id || announcement?.id;
  const matchingOrders = guestOrders.filter(
    (order) => order.announcementId === announcementId,
  );

  return {
    orderCount: matchingOrders.length,
    deliveryCollected: matchingOrders.reduce(
      (total, order) => total + Number(order.deliveryFees || 0),
      0,
    ),
  };
}

export function isAnnouncementConditionMet(
  announcement,
  guestOrders,
  now = Date.now(),
) {
  const settings = announcement?.settings || {};

  if (settings.closingPolicy === "deadline") {
    const deadline = new Date(settings.deadline).getTime();

    return Number.isFinite(deadline) && deadline <= now;
  }

  if (settings.closingPolicy === "delivery_target") {
    const target = Number(settings.targetDeliveryAmount);

    if (!Number.isFinite(target) || target <= 0) {
      return false;
    }

    return (
      getAnnouncementOrderTotals(announcement, guestOrders).deliveryCollected >=
      target
    );
  }

  return false;
}
