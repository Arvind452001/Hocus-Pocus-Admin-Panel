import React, { useEffect, useRef, useState } from "react";
import axiosJSONData from "../api/axiosJSONData";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";

const ContactMessages = () => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
console.log("Selected Message:", selectedMessage); // Debug log 
  const [loading, setLoading] = useState(false);

  // ✅ reply mode
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const [replyForm, setReplyForm] = useState({
    title: "",
    body: "",
    notification_type: "",
    data: "",
    save_to_db: true,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const modalRef = useRef(null);
  const closeModal = () => {
  const modal = window.bootstrap.Modal.getInstance(modalRef.current);
  modal?.hide();
};

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const res = await axiosJSONData.get(
        `/admin/support-messages?page=${page}&limit=${limit}`
      );

      if (res.data.status === 1) {
        setMessages(res.data.messages);
        setTotalPages(res.data.pages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  const handleView = (msg) => {
    setSelectedMessage(msg);
    setIsReplyMode(false); // reset
  };

  // ✅ handle reply input
  const handleReplyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReplyForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ submit reply
  const handleReplySubmit = async () => {
    try {
      setReplyLoading(true);

      const payload = {
        user_id: selectedMessage?.id, // ✅ auto set
        title: replyForm.title,
        body: replyForm.body,
        notification_type: replyForm.notification_type,
        data: replyForm.data,
        save_to_db: replyForm.save_to_db,
      };

      await axiosJSONData.post("/notifications/admin/contect-notification", payload);

      alert(t("contactMessages.success"));
      closeModal();
      setIsReplyMode(false);
      setReplyForm({
        title: "",
        body: "",
        notification_type: "",
        data: "",
        save_to_db: true,
      });
   } catch (err) {
      console.error(err);
      alert(t("contactMessages.failed"));
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{t("sideBar.ContactMessages")}</h3>

      {/* TABLE */}
      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>{t("users.email")}</th>
                <th>{t("support.subject")}</th>
                <th>{t("userDetails.date")}</th>
                <th>{t("users.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <tr key={msg.id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{msg.user_email}</td>
                    <td>{msg.subject}</td>
                    <td>
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#viewModal"
                        onClick={() => handleView(msg)}
                      >
                        {t("common.view")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    {t("common.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔽 MODAL */}
      <div ref={modalRef} className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {isReplyMode ? t("contactMessages.replyMessage") : t("common.view")}
              </h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {selectedMessage && !isReplyMode && (
                <>
                  <p><strong>{t("contactMessages.emailLabel")}</strong> {selectedMessage.user_email}</p>
                  <p><strong>{t("contactMessages.subjectLabel")}</strong> {selectedMessage.subject}</p>
                  <p><strong>{t("contactMessages.messageLabel")}</strong> {selectedMessage.message}</p>
                </>
              )}

              {/* ✅ REPLY FORM */}
              {isReplyMode && (
                <>
                   <input
                    type="text"
                    name="title"
                    placeholder={t("notification.title")}
                    className="form-control mb-2"
                    value={replyForm.title}
                    onChange={handleReplyChange}
                  />

                   <textarea
                    name="body"
                    placeholder={t("notification.body")}
                    className="form-control mb-2"
                    value={replyForm.body}
                    onChange={handleReplyChange}
                  />

                   <select
                    name="notification_type"
                    className="form-control mb-2"
                    value={replyForm.notification_type}
                    onChange={handleReplyChange}
                  >
                    <option value="">{t("notification.selectType")}</option>
                    <option value="info">{t("notification.typeInfo")}</option>
                    <option value="alert">{t("notification.typeAlert")}</option>
                  </select>

                   <textarea
                    name="data"
                    placeholder={t("notification.extraData")}
                    className="form-control mb-2"
                    value={replyForm.data}
                    onChange={handleReplyChange}
                  />

                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="save_to_db"
                      checked={replyForm.save_to_db}
                      onChange={handleReplyChange}
                      className="form-check-input"
                    />
                     <label className="form-check-label">
                      {t("notification.saveToDb")}
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              {!isReplyMode ? (
                <>
                   <button
                    className="btn btn-primary"
                    onClick={() => setIsReplyMode(true)}
                  >
                    {t("contactMessages.reply")}
                  </button>
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    {t("common.close")}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-success"
                    onClick={handleReplySubmit}
                    disabled={replyLoading}
                  >
                     {replyLoading ? <span className="spinner-border spinner-border-sm me-2" role="status"></span> : t("contactMessages.sendReply")}
                  </button>
 
                   <button
                    className="btn btn-secondary"
                    onClick={() => setIsReplyMode(false)}
                  >
                    {t("contactMessages.back")}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;