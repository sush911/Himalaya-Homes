import React from "react";

export default function Home() {
  return (
    <div className="container my-5">
      <div className="hero text-center">
        <h1 style={{ color: "var(--dark-blue)" }}>Welcome to Himalaya Homes</h1>
        <p style={{ color: "rgba(51,51,51,0.75)" }}>Browse, buy, rent, or sell properties easily with your account.</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <a href="/buy" className="btn btn-primary-custom">Explore Properties</a>
          <a href="/sell" className="btn btn-outline-custom">Sell Property</a>
        </div>
      </div>

      <h3 className="mt-5 mb-3" style={{ color: "var(--dark-blue)" }}>Featured Properties</h3>
      <div className="row g-4">
        {[1,2,3,4].map((i)=>(
          <div className="col-md-3" key={i}>
            <div className="card-featured">
              <div style={{ height: 140, background: "#ccc", borderRadius: 8 }} />
              <h5 className="mt-2">Property {i}</h5>
              <p style={{ fontSize: 13 }}>Some description of the property.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
