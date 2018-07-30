import React from 'react';
import View from 'components/main/pages/home/views/View';

import Courses from './contents/Courses';

class StudentHome extends View {

  render() {
    this.init(this.props);
    return(
      <div style={this.viewStyle()}>
        <Courses app={this.props.app}/>
      </div>
    )
  }
}

export default StudentHome;
