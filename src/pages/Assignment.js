import API from "../api";
import Menu from "../components/Menu";
import React from "react";
import ReviewAssignment from "./sections/ReviewAssignment";
import TaskContent from "../components/TaskContent";
import TaskHeader from "../components/TaskHeader";
import cheerio from "cheerio";
import moment from "moment";
import { useParams } from "react-router-dom";
import useRole from "../hooks/useRole";
import StudentViewFeedback from "../components/StudentViewFeedback";
import styled from "styled-components";


const Wrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%; 
	/* calc(100vh - 139px); */
`;

export default () => {
	const [role] = useRole();

	const { id } = useParams();
	const [record, setRecord] = React.useState(null);
	const [feedbackContent, setFeedbackContent] = React.useState(null);
	const [loading, setLoading] = React.useState("Loading assignment data...");
	const [error, setError] = React.useState();
	const [content, setContent] = React.useState("");
	const [studentCompleted, setStudentCompleted] = React.useState();
	const [reviewId, setReviewId] = React.useState();
	// const [feedbackStatus, setFeedbackStatus] = React.useState();
	// const [feedbackEffort, setFeedbackEffort] = React.useState();
	// const [feedbackMessage, setFeedbackMessage] = React.useState();



	const translateDate = (date) => {
		return moment(new Date(date)).format("MMM Do YY");
	};

	const translateDatetoWeek = (date) => {
		return moment(new Date(date)).format("dddd");
	};

	const parseContent = (content) => {
		const $ = cheerio.load(content);

		$("a").prepend(
			`<h1>Attachments</h1><img src='${require("../assets/icons/paperclip.svg")}' />`
		);

		return $.html()
			.replace("<html><head></head><body>", "")
			.replace("</body></html>", "");
	};

	React.useEffect(() => {
		if (loading) {
			(async function () {
				try {
					const response = await API.get(`assignment/${id}`);

					if (!response.hasOwnProperty("content"))
						throw new Error("Empty response");

					const record = response.content[0].fields;

					const assignmentReviews = await API.get(`reviews?assignment_id=${id}`);
					const feedbackContent = assignmentReviews.content[0].fields;
					setFeedbackContent(feedbackContent);
					
					console.log(feedbackContent);

					const {
						content: [
							{
								fields: { Student_Checked, id: reviewId },
							},
						],
					} = await API.get(`reviews?assignment_id=${id}`);



					setReviewId(reviewId);
					setStudentCompleted(Student_Checked);
					setRecord(record);
					setContent(parseContent(record.Content));
					setLoading(false);
				} catch (err) {
					setError(err.toString());
				}
			})();
		}
	}, [loading]);

	const handleCompletedChange = async () => {
		await API.update(`review/${reviewId}`, {
			Student_Checked: !studentCompleted,
		});

		setStudentCompleted(!studentCompleted);
	};

	const handleAssignmentFeedbackStatus = (status) =>{

	}

	return !loading ? (
		<React.Fragment>
			<Wrapper>
			<TaskHeader
				image={record.Class_Icon[0].url}
				subject={record.Class_Name}
				week={translateDatetoWeek(record.Due)}
				date={translateDate(record.Due)}
				number={record.Expected_Time}
				time={record.Expected_Time_Unit}
			/>
			<TaskContent
				loading={loading}
				error={error}
				complete={studentCompleted}
				onChange={handleCompletedChange}
			>
				<div dangerouslySetInnerHTML={{ __html: content }} />

				
			</TaskContent>
			<StudentViewFeedback 
				content={feedbackContent.Feedback}
				status={feedbackContent.Status}
				effort={feedbackContent.Effort}
				pending={feedbackContent.Status=="Pending"}
				handed={feedbackContent.Status=="Handed In"}
				resubmit={feedbackContent.Status=="Re-submit"}
				/>
			</Wrapper>
			<Menu activeAssignment={true} activeAvatar={false} />
		</React.Fragment>
	) : (
		"Loading..."
	);
};
