import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const TarotCards = () => {
  return (
    <div className="admin-app">
      <Sidebar />

      <div className="content">
        <Header title="Tarot Cards" />

        <main className="container-fluid mt-4">
          <div className="card">
            <div className="card-body text-center">

              <h5 className="mb-3">Tarot Cards</h5>

              <p className="text-muted">
                Tarot cards content will appear here...
              </p>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TarotCards;