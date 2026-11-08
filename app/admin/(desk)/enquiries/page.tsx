import { setEnquiryStatusAction } from "@/lib/actions";
import { deliveryLabel, enquiryLabel, formatDate } from "@/lib/format";
import { getEnquiries } from "@/lib/store";
import type { EnquiryStatus } from "@/lib/types";

export const metadata = { title: "Enquiries", robots: { index: false, follow: false } };

const nextStatus: Record<EnquiryStatus, EnquiryStatus> = {
  new: "read",
  read: "archived",
  archived: "new",
};

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();
  return (
    <div>
      <h1 className="font-serif text-5xl">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="mt-8 text-sm">No enquiries yet.</p>
      ) : (
        <ul className="mt-10 flex flex-col gap-8">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className="border-b border-espresso/10 pb-8">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-espresso/50">
                {enquiryLabel(enquiry.type)} · {formatDate(enquiry.createdAt)} · {enquiry.status}
              </p>
              <h2 className="mt-2 font-serif text-3xl">{enquiry.name}</h2>
              <p className="mt-2 text-sm">
                {enquiry.email}
                {enquiry.phone ? ` · ${enquiry.phone}` : ""}
              </p>
              {enquiry.productName ? <p className="mt-2 text-sm">Piece: {enquiry.productName}</p> : null}
              {enquiry.businessName ? (
                <p className="mt-2 text-sm">
                  {enquiry.businessName}
                  {enquiry.role ? ` · ${enquiry.role}` : ""}
                </p>
              ) : null}
              {enquiry.destination ? <p className="mt-2 text-sm">Destination: {enquiry.destination}</p> : null}
              {enquiry.deliveryScope ? <p className="mt-1 text-sm">{deliveryLabel(enquiry.deliveryScope)}</p> : null}
              {enquiry.quantity ? <p className="mt-1 text-sm">Quantity: {enquiry.quantity}</p> : null}
              {enquiry.interests.length > 0 ? <p className="mt-1 text-sm">Interests: {enquiry.interests.join(", ")}</p> : null}
              {enquiry.projectType ? <p className="mt-1 text-sm">Project: {enquiry.projectType}</p> : null}
              <p className="mt-4 max-w-2xl text-sm leading-6">{enquiry.message}</p>
              <form action={setEnquiryStatusAction} className="mt-4">
                <input type="hidden" name="id" value={enquiry.id} />
                <input type="hidden" name="status" value={nextStatus[enquiry.status]} />
                <button type="submit" className="text-[0.68rem] uppercase tracking-[0.18em]">
                  Mark {nextStatus[enquiry.status]}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
