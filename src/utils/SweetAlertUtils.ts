import Swal from "sweetalert2";

export const showSuccessAlert = (message: string) => {
  Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Success</span>`,
    html: `
    <p class="text-muted small m-0 p-0 pb-3">
    ${message}
    </p>
  `,
    iconHtml: `<i class="bi bi-check-circle-fill"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0 w-custom",
      confirmButton: "btn btn-success btn-success2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0 text-success2",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
  });
};

export const showFailedAlert = (message: string) => {
  Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Failed</span>`,
    html: `
      <p class="text-muted small m-0 p-0 pb-3">
      ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-x-circle-fill"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0 w-custom",
      confirmButton: "btn btn-success btn-danger2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0 text-danger2",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
  });
};

export const showWarningAlert = (message: string) => {
  return Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Warning</span>`,
    html: `
      <p class="text-muted small m-0 p-0 pb-3">
      ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-exclamation-circle-fill"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0 w-custom",
      confirmButton: "btn btn-success btn-warning2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0 text-warning2",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
  });
};
