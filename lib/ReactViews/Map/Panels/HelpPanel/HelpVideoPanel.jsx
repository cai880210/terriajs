import classNames from "classnames";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Icon from "../../../Icon.jsx";
import Loader from "../../../Loader";
import Styles from "./help-panel.scss";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import Box from "../../../../Styled/Box";
import { action } from "mobx";
import VideoGuide from "./VideoGuide";

const HELP_VIDEO_NAME = "helpVideo";

@observer
class HelpVideoPanel extends React.Component {
  static displayName = "HelpVideoPanel";

  static propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    itemString: PropTypes.string,
    description: PropTypes.array,
    videoLink: PropTypes.string,
    background: PropTypes.string,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showVideoGuide: false,
      videoGuideVisible: false
    };
  }

  @action.bound
  toggleVideoGuide() {
    const showVideoGuide = this.state.showVideoGuide;
    // If not enabled
    if (!showVideoGuide) {
      this.setState({
        showVideoGuide: !showVideoGuide,
        videoGuideVisible: true
      });
    }
    // Otherwise we immediately trigger exit animations, then close it 300ms later
    if (showVideoGuide) {
      this.setState({
        showVideoGuide: !showVideoGuide,
        videoGuideVisible: false
      });
    }
  }

  renderVideoGuide() {
    return (
      <div
        className={Styles.videoGuideWrapperFullScreen}
        onClick={this.toggleVideoGuide}
      >
        <div
          className={Styles.videoGuide}
          onClick={e => e.stopPropagation()}
          style={{
            backgroundImage: `url(${this.props.background})`
          }}
        >
          <div className={Styles.videoGuideRatio}>
            <div className={Styles.videoGuideLoading}>
              <Loader message={` `} />
            </div>
            <iframe
              className={Styles.videoGuideIframe}
              src={this.props.videoLink}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    // const { t } = this.props;
    const itemSelected =
      this.props.viewState.selectedHelpMenuItem === this.props.itemString;
    const isExpanded = this.props.viewState.selectedHelpMenuItem !== "";
    const className = classNames({
      [Styles.videoPanel]: true,
      [Styles.isVisible]: isExpanded,
      // when the help entire video panel is invisible (hidden away to the right)
      [Styles.shiftedToRight]:
        !isExpanded ||
        !this.props.viewState.showHelpMenu ||
        this.props.viewState.topElement !== "HelpPanel",
      [Styles.isHidden]: !itemSelected // when the item isn't selected
    });
    return (
      <div className={className}>
        {/* {this.state.showVideoGuide && this.renderVideoGuide()} */}
        <VideoGuide 
          viewState={this.props.viewState}
          videoLink={this.props.videoLink}
          background={this.props.background}
          videoName={HELP_VIDEO_NAME}
        />
        <Box
          centered
          fullWidth
          fullHeight
          displayInlineBlock
          paddedHorizontally={4}
          paddedVertically={18}
        >
          <div
            className={Styles.videoLink}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(${this.props.background})`
            }}
          >
            <button className={Styles.videoBtn} onClick={() => this.props.viewState.setVideoGuideVisible(HELP_VIDEO_NAME)}>
              <Icon glyph={Icon.GLYPHS.play} />
            </button>
          </div>
          <Spacing bottom={5} />
          <Text subHeading bold textDark>
            {this.props.title}
          </Text>
          <For each="desc" of={this.props.description}>
            <Spacing bottom={3} />
            <Text medium textDark>
              {desc}
            </Text>
          </For>
        </Box>
      </div>
    );
  }
}

export default withTranslation()(withTheme(HelpVideoPanel));
