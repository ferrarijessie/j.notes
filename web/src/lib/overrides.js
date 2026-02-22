export const authInputOverrides = {
    Root: { 
        style: { 
            width: "320px", 
            maxWidth: "100%",
            background: "#FAF1E3",
            border: "2px solid #957139",
            paddingRight: "0px",
        } 
    },
    Input: {
        style: {
            background: "#FAF1E3",
        }
    },
    InputContainer: {
        style: {
            background: "#FAF1E3",
            boxShadow: "none",
        },
    },
    MaskToggleButton: {
        style: {
            color: "#957139",
        }
    }
}

export const authButtonOverrides = {
    BaseButton: {
        style: {
            width: "320px", 
            maxWidth: "100%",
            border: "2px solid #957139 !important",
            color: "#957139 !important",
            backgroundColor: "#FAF1E3 !important",
            marginTop: "20px"
        }
    }
}

export const authLinkOverrides = { 
    margin: 0, 
    fontSize: 12, 
    color: "#b2875a", 
    textDecoration: "underline" 
}

export const errorBannerOverrides = {
    Root: {
        style: {
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(229, 62, 62, 0.14)",
            border: "1px solid rgba(229, 62, 62, 0.55)",
            borderRadius: "10px",
            justifySelf: "anchor-center"
        }
    },
    Message: {
        style: {
            color: "#C53030", 
            fontWeight: 600
        }
    }
}
