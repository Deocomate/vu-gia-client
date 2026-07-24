import { formatVnd } from "@/shared/api/admin-api";

export default function OrderPaymentPanel({ payment }) {
  if (!payment) return null;

  return (
    <section className="border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Thanh toán VietQR</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Đơn sẽ tự chuyển PAID khi SePay xác nhận chuyển khoản qua nội dung bên dưới.
      </p>
      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row">
        {payment.qrImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={payment.qrImageUrl} alt="VietQR" className="h-48 w-48 border border-zinc-200 object-contain" />
        )}
        <dl className="grid flex-1 gap-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Số tiền</dt>
            <dd className="font-semibold text-zinc-950">{formatVnd(payment.amount)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Ngân hàng</dt>
            <dd className="font-semibold text-zinc-950">{payment.bankName}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Số tài khoản</dt>
            <dd className="font-semibold text-zinc-950">{payment.accountNumber}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Chủ tài khoản</dt>
            <dd className="font-semibold text-zinc-950">{payment.accountHolder}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">Nội dung CK</dt>
            <dd className="font-semibold text-zinc-950">{payment.transferContent}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
