// ChatSidebar.tsx
import React from "react";
import VerifyMailCard from "../../components/ui/VerifyMailCard";

const SideBar: React.FC = () => {
  const styles = {
    sidebar: {
      width: "25%",
      backgroundColor: "#fff",
      borderRight: "1px solid #ddd",
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",

    },
    sidebarList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      overflowY: "auto",  // Scroll if list overflows

    },
    sidebarItem: {
      padding: "12px 12px",
      fontSize: "16px",
      color: "#333",
      cursor: "pointer",
      borderRadius: "10px",
    },
    activeItem: {
      backgroundColor: "#f0f0f0",
      fontWeight: "bold" as const,
    },
    status: {
      float: "right" as const,
      fontSize: "12px",
      padding: "4px 8px",
      borderRadius: "8px",
      fontWeight: "500",
    },
    ticketRaised: {
      backgroundColor: "#f3e5ff",
      color: "#7c4dff",
    },
    resolved: {
      backgroundColor: "#e8f5e9",
      color: "#4caf50",
    },
    date: {
      float: "right" as const,
      fontSize: "12px",
      color: "#999",
    },
    timeAgo: {
      color: "#ff6f00",
    },
    verifyCardWrapper: {
        marginTop: "auto",
        width: "100%",  // Full width of sidebar
      },
  };

  return (
    <aside style={styles.sidebar}>
      <ul style={styles.sidebarList}>
        <li style={{ ...styles.sidebarItem, ...styles.activeItem }}>
          My password reset
        </li>
        <li style={styles.sidebarItem}>
          How to connect wifi?{" "}
          <span style={{ ...styles.status, ...styles.ticketRaised }}>
            Ticket raised
          </span>
        </li>
        <li style={styles.sidebarItem}>
          Requested new laptop{" "}
          <span style={{ ...styles.status, ...styles.resolved }}>Resolved</span>
        </li>
        <li style={styles.sidebarItem}>
          HP Printer Setup Help{" "}
          <span style={{ ...styles.date, ...styles.timeAgo }}>2 days ago</span>
        </li>
        <li style={styles.sidebarItem}>
          What is the update on my...{" "}
          <span style={{ ...styles.date, ...styles.timeAgo }}>2 days ago</span>
        </li>
      </ul>
      <div style={styles.verifyCardWrapper}>
        <VerifyMailCard />
      </div>
    </aside>
  );
};

export default SideBar;


// import React from "react";

// const SideBar: React.FC = () => {
//   const styles = {
//     sidebar: {
//       width: "22%",
//       backgroundColor: "#fff",
//       borderRight: "1px solid #ddd",
//       padding: "16px",
//     },
//     sidebarList: {
//       listStyleType: "none",
//       padding: 0,
//       margin: 0,
//     },
//     sidebarItem: {
//       padding: "12px 12px",
//       fontSize: "16px",
//       color: "#333",
//       cursor: "pointer",
//       borderRadius: "10px",
//     },
//     activeItem: {
//       backgroundColor: "#f0f0f0",
//       fontWeight: "bold" as const,
//     },
//     status: {
//       float: "right" as const,
//       fontSize: "12px",
//       padding: "4px 8px",
//       borderRadius: "8px",
//       fontWeight: "500",
//     },
//     ticketRaised: {
//       backgroundColor: "#f3e5ff",
//       color: "#7c4dff",
//     },
//     resolved: {
//       backgroundColor: "#e8f5e9",
//       color: "#4caf50",
//     },
//     date: {
//       float: "right" as const,
//       fontSize: "12px",
//       color: "#999",
//     },
//     timeAgo: {
//       color: "#ff6f00",
//     },
//   };

//   return (
//     <aside style={styles.sidebar}>
//       <ul style={styles.sidebarList}>
//         <li style={{ ...styles.sidebarItem, ...styles.activeItem }}>My password reset</li>
//         <li style={styles.sidebarItem}>
//           How to connect wifi? <span style={{ ...styles.status, ...styles.ticketRaised }}>Ticket raised</span>
//         </li>
//         <li style={styles.sidebarItem}>
//           Requested new laptop <span style={{ ...styles.status, ...styles.resolved }}>Resolved</span>
//         </li>
//         <li style={styles.sidebarItem}>
//           HP Printer Setup Help <span style={{ ...styles.date, ...styles.timeAgo }}>2 days ago</span>
//         </li>
//         <li style={styles.sidebarItem}>
//           What is the update on my... <span style={{ ...styles.date, ...styles.timeAgo }}>2 days ago</span>
//         </li>
//       </ul>
//     </aside>
//   );
// };

// export default SideBar;
