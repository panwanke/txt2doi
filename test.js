const requests = require("./src/request")

const main = async () => {
    const txt = `
        Guess, A., Lyons, B., Nyhan, B., & Reifler, J. (2018). Avoiding the echo chamber about echo chambers: Why selective exposure to like-minded political news is less prevalent than you think.
        Hart, W., Albarracín, D., Eagly, A. H., Brechan, I., Lindberg, M. J., & Merrill, L. (2009). Feeling validated versus being correct: A meta-analysis of selective exposure to information. Psychological Bulletin, 135(4), 555–588. https://doi.org/10.1037/a0015701
        Kahan, D. M. (2012). Ideology, Motivated Reasoning, and Cognitive Reflection: An Experimental Study. SSRN Electronic Journal. https://doi.org/10.2139/ssrn.2182588
        Klein, N., & Epley, N. (2017). Less Evil Than You: Bounded Self-Righteousness in Character Inferences, Emotional Reactions, and Behavioral Extremes. Personality and Social Psychology Bulletin, 43(8), 1202–1212. https://doi.org/10.1177/0146167217711918
        Knobloch-Westerwick, S. & Jingbo Meng. (2009). Looking the Other Way: Selective Exposure to Attitude-Consistent and Counterattitudinal Political Information. Communication Research, 36(3), 426–448. https://doi.org/10.1177/0093650209333030
        Mummolo, J. (2016). News from the Other Side: How Topic Relevance Limits the Prevalence of Partisan Selective Exposure. The Journal of Politics, 78(3), 763–773. https://doi.org/10.1086/685584
        Prior, M. (2013). The Challenge of Measuring Media Exposure: Reply to Dilliplane, Goldman, and Mutz. Political Communication, 30(4), 620–634. https://doi.org/10.1080/10584609.2013.819539
        Reed, A., Whittaker, J., Votta, F., & Looney, S. (2019). Radical Filter Bubbles Social Media Personalisation Algorithms and Extremist Content. https://www.semanticscholar.org/paper/Radical-Filter-Bubbles-Social-Media-Personalisation-Reed-Whittaker/5c8fa37358507b92eef04cc670227aa9245fb9ab
        Sui, J., He, X., & Humphreys, G. W. (2012). Perceptual effects of social salience: Evidence from self-prioritization effects on perceptual matching. Journal of Experimental Psychology: Human Perception and Performance, 38(5), 1105–1117. https://doi.org/10.1037/a0029792
        Sunstein, C. R. (2009). Going to extremes: How like minds unite and divide.
        Swire, B., Berinsky, A. J., Lewandowsky, S., & Ecker, U. K. H. (2017). Processing political misinformation: Comprehending the Trump phenomenon. Royal Society Open Science, 4(3), 160802. https://doi.org/10.1098/rsos.160802
        Tappin, B. M., Pennycook, G., & Rand, D. G. (2020). Thinking clearly about causal inferences of politically motivated reasoning: Why paradigmatic study designs often undermine causal inference. Current Opinion in Behavioral Sciences, 34, 81–87. https://doi.org/10.1016/j.cobeha.2020.01.003
        Terren, L., Open University of Catalonia, Borge-Bravo, R., & Open University of Catalonia. (2021). Echo Chambers on Social Media: A Systematic Review of the Literature. Review of Communication Research, 9, 99–118. https://doi.org/10.12840/ISSN.2255-4165.028
        Wiecki, T. V., Sofer, I., & Frank, M. J. (2013). HDDM: Hierarchical Bayesian estimation of the Drift-Diffusion Model in Python. Frontiers in Neuroinformatics, 7. https://doi.org/10.3389/fninf.2013.00014



    `;

    let res = await requests(txt, 1);
    console.log(res.length);
}

main();
