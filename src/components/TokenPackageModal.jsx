import { useEffect, useState } from "react"

const TokenPackageModal = ({
  show,
  onClose,
  mode,
  selectedData,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    tokens: 1,
    price: 0,
    currency: "USD",
    is_popular: false,
    is_active: true,
    sort_order: 0,
  })

  useEffect(() => {
    if (selectedData) {
      setForm(selectedData)
    } else {
      setForm({
        name: "",
        tokens: 1,
        price: 0,
        currency: "USD",
        is_popular: false,
        is_active: true,
        sort_order: 0,
      })
    }
  }, [selectedData, show])

  if (!show) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    })
  }

  const isView = mode === "view"

  return (
    <>
      {/* BACKDROP */}
      <div
        className="modal-backdrop show"
        style={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="modal d-block" style={{ zIndex: 1055 }}>
        <div className="modal-dialog">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === "add" && "Add Package"}
                {mode === "edit" && "Edit Package"}
                {mode === "view" && "View Package"}
              </h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/* NAME */}
              <input
                className="form-control mb-2"
                name="name"
                placeholder="Package Name"
                value={form.name}
                onChange={handleChange}
                disabled={isView}
              />

              {/* TOKENS */}
              <input
                className="form-control mb-2"
                name="tokens"
                type="number"
                min={1}
                placeholder="Tokens"
                value={form.tokens}
                onChange={handleChange}
                disabled={isView}
              />

              {/* PRICE */}
              <input
                className="form-control mb-2"
                name="price"
                type="number"
                min={0}
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                disabled={isView}
              />

              {/* CURRENCY */}
              <input
                className="form-control mb-2"
                name="currency"
                placeholder="Currency (USD)"
                value={form.currency}
                onChange={handleChange}
                disabled={isView}
              />

              {/* POPULAR */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_popular"
                  checked={form.is_popular}
                  onChange={handleChange}
                  disabled={isView}
                />
                <label className="form-check-label">
                  Popular Package
                </label>
              </div>

              {/* ACTIVE */}
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  disabled={isView}
                />
                <label className="form-check-label">
                  Active
                </label>
              </div>

              {/* SORT ORDER */}
              <input
                className="form-control mb-2"
                name="sort_order"
                type="number"
                placeholder="Sort Order"
                value={form.sort_order}
                onChange={handleChange}
                disabled={isView}
              />

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>

              {mode !== "view" && (
                <button
                  className="btn btn-primary"
                  onClick={() => onSubmit(form)}
                >
                  Save
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default TokenPackageModal